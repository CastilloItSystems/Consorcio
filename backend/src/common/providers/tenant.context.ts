import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';

/**
 * Request-scoped provider that exposes the tenant identified by middleware
 * so other services can inject this provider and read the current tenant id/slug.
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private tenant: { id?: string; slug?: string } | null;

  constructor() {
    this.tenant = null;
  }

  // Called by middleware or an adapter (we will wire in a small helper in app)
  setTenantFromRequest(req: Request & { tenant?: any }) {
    this.tenant = req.tenant || null;
  }

  getTenantId(): string | null {
    return this.tenant?.id ?? null;
  }

  getTenantSlug(): string | null {
    return this.tenant?.slug ?? null;
  }

  getTenant() {
    return this.tenant;
  }
}
