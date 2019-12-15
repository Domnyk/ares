import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, iif } from 'rxjs';

import { AuthService } from '../service/auth.service';
import { takeUntil, flatMap } from 'rxjs/operators';
import { CurrentUser } from '../model/current-user';
import { InterceptorUtils } from './utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private utils: InterceptorUtils) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.utils.isAuthReq(req) || this.utils.isAssetsReq(req)) {
      console.warn('Address does not require for authorization header to be inserted. ' +
                   'Returning request without authorization header.');
      return next.handle(req);
    }

    return this.authService.currentUser.pipe(
      flatMap((currentUser: CurrentUser | null) => this.insertAuthHeader(currentUser, req, next))
    );
  }

  private insertAuthHeader(currentUser: CurrentUser | null, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (currentUser === null) {
      console.warn('currentUser is null. Returning request without authorization header.');
      return next.handle(req);
    }

    const { token } = currentUser;
    const authHeader = `Token ${token}`;
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });

    return next.handle(authReq);
  }
}
