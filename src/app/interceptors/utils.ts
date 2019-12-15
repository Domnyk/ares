import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterceptorUtils {
  isAuthReq(req: HttpRequest<any>): boolean {
    return req.url.includes(environment.loginPath);
  }

  isAssetsReq(req: HttpRequest<any>): boolean {
    return req.url.includes('assets');
  }
}
