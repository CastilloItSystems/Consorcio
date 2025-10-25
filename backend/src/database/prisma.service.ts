import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // optional current tenant context (set per-request by middleware or a request-scoped provider)
  private _currentTenantId: string | null = null;

  setTenant(tenantId: string | null) {
    this._currentTenantId = tenantId;
  }

  getTenant() {
    return this._currentTenantId;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
