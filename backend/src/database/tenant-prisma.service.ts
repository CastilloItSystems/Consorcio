import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContext } from '../common/providers/tenant.context';

/**
 * Request-scoped tenant-aware Prisma proxy.
 * It wraps the Prisma client and injects tenant filters for models that are tenant-scoped.
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaService {
  public client: any;

  // models that should be filtered by companyId when tenant is present
  private tenantModels = new Set(['product']);

  constructor(
    private prisma: PrismaService,
    private tenantContext: TenantContext,
  ) {
    const tenantId = tenantContext.getTenantId();

    const handler = {
      get: (target: any, prop: string) => {
        // if accessing a model (e.g., product)
        if (prop in target) {
          const modelClient = target[prop];

          // only wrap objects (models)
          if (typeof modelClient === 'object') {
            return new Proxy(modelClient, {
              get: (mTarget: any, mProp: string) => {
                const orig = mTarget[mProp];
                if (typeof orig !== 'function') return orig;

                // wrap common query methods
                return (...args: any[]) => {
                  // If model is tenant-scoped, apply companyId filter
                  const isTenantModel = this.tenantModels.has(prop);

                  // build query arg object
                  const q = args[0] || {};

                  if (isTenantModel && tenantId) {
                    if (mProp === 'findUnique') {
                      // convert to findFirst with id + companyId
                      const id = q.where?.id;
                      const newWhere = { id, companyId: tenantId };
                      return mTarget.findFirst({ ...q, where: newWhere });
                    }

                    if (
                      mProp === 'findFirst' ||
                      mProp === 'findMany' ||
                      mProp === 'delete'
                    ) {
                      const existingWhere = q.where || {};
                      q.where = { ...existingWhere, companyId: tenantId };
                      return orig.apply(mTarget, [q]);
                    }

                    if (mProp === 'update' || mProp === 'updateMany') {
                      // ensure update targets only tenant's rows
                      const existingWhere = q.where || {};
                      q.where = { ...existingWhere, companyId: tenantId };
                      return orig.apply(mTarget, [q]);
                    }

                    if (mProp === 'create') {
                      // ensure created records are linked to tenant
                      const data = q.data || {};
                      q.data = { ...data, companyId: tenantId };
                      return orig.apply(mTarget, [q]);
                    }
                  }

                  // fallback: call original
                  return orig.apply(mTarget, args);
                };
              },
            });
          }
          return modelClient;
        }

        // otherwise forward
        return target[prop];
      },
    };

    this.client = new Proxy(this.prisma as any, handler);
  }
}
