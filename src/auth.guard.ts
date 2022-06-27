import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private appService: AppService) {}
  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateApiKey(request);
  }

  async validateApiKey(request) {
    const key = request.query?.key;
    if (!key) return false;
    return !!(await this.appService.checkKeyForAdmin(key));
  }
}
