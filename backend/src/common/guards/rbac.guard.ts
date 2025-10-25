import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // If no permissions are required, allow
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenant = request.tenant;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!tenant) {
      throw new ForbiddenException('Tenant not identified');
    }

    // Find membership
    // PrismaClient exposes model actions at runtime; type system may not reflect dynamic additions.
    const prismaAny = this.prisma as any;

    const membership = await prismaAny.membership.findFirst({
      where: {
        userId: user.id,
        company: { OR: [{ id: tenant.id }, { slug: tenant.slug }] },
      },
      include: {
        role: {
          include: { rolePermissions: { include: { permission: true } } },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('User has no membership for tenant');
    }

    const userPermissions =
      membership.role?.rolePermissions?.map(
        (rp: { permission: { key: string } }) => rp.permission.key,
      ) || [];

    const hasAll = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );

    if (!hasAll) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // passed
    request.membership = membership;
    return true;
  }
}
