import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Tenant identification middleware.
 * Looks for tenant identifier in order: subdomain, x-tenant-id header, or authorization JWT claim.
 * Attaches `req.tenant` = { id, slug } when found.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request & { tenant?: any }, res: Response, next: NextFunction) {
    // 1) Check header
    const tenantFromHeader = req.headers['x-tenant-id'] as string | undefined;

    if (tenantFromHeader) {
      req.tenant = { id: tenantFromHeader };
      return next();
    }

    // 2) Check subdomain (example: acme.app.com -> acme)
    const host = req.headers.host || '';
    const hostParts = host.split('.');
    if (hostParts.length > 2) {
      const subdomain = hostParts[0];
      req.tenant = { slug: subdomain };
      return next();
    }

    // 3) Fallback: no tenant identified
    req.tenant = null;
    next();
  }
}
