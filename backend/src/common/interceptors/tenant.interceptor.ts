import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from '../providers/tenant.context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private tenantContext: TenantContext) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as any;
    if (req && this.tenantContext) {
      this.tenantContext.setTenantFromRequest(req);
    }
    return next.handle();
  }
}
