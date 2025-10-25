import { Global, Module, Scope } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContext } from '../common/providers/tenant.context';
import { TenantPrismaService } from './tenant-prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: TenantContext, useClass: TenantContext, scope: Scope.REQUEST },
    // TenantPrismaService is request-scoped and depends on TenantContext
    TenantPrismaService,
  ],
  exports: [PrismaService, TenantContext, TenantPrismaService],
})
export class DatabaseModule {}
