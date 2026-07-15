import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, params } = request;
    const handler = context.getHandler().name;

    return next.handle().pipe(
      tap((response) => {
        const skipAudit = this.reflector.get<boolean>('skipAudit', context.getHandler());
        if (skipAudit) return;

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          this.auditService.log({
            action: `${method} ${url}`,
            entity: url.split('/')[2] || 'unknown',
            entityId: params?.id,
            userId: user?.id,
            userEmail: user?.email,
            method,
            url,
            details: { body, response },
            ip: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      }),
    );
  }
}
