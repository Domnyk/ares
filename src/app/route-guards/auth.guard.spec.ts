import {Location} from '@angular/common';
import {Component} from '@angular/core';
import {async, fakeAsync, flush, inject, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router, Routes} from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {AuthGuard} from './auth.guard';
import {of} from 'rxjs';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-mock-login',
  template: '<p>Mock Login</p>'
})
class MockLoginComponent {
}

@Component({
  selector: 'app-mock-main',
  template: '<p>Mock Main</p>'
})
class MockMainComponent {
}

describe('AuthGuard', () => {
  beforeEach(async(() => {
    const routes: Routes = [
      {
        path: '', canActivateChild: [AuthGuard], children: [
          {path: 'main', component: MockMainComponent}
        ]
      },
      {path: 'login', component: MockLoginComponent}
    ];

    TestBed.configureTestingModule({
      declarations: [MockMainComponent, MockLoginComponent],
      providers: [AuthGuard],
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule]
    });
  }));

  it('should instantiate', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('canActivateChild', () => {
    let authGuard: AuthGuard;
    const authService: AuthService = new AuthService(null);
    let router: Router;
    let location: Location;

    beforeEach(() => {
      router = TestBed.get(Router);
      router.initialNavigation();
      location = TestBed.get(Location);
    });

    it('should redirect user to login page when user not logged in', fakeAsync(() => {
      spyOnProperty(authService, 'isLoggedIn').and.returnValue(of(false));
      authGuard = new AuthGuard(authService, router);
      authGuard.canActivateChild(null, router.routerState.snapshot).subscribe();
      tick();
      expect(location.path()).toBe('/login');
    }));

    it('should return false when user not logged in', fakeAsync(() => {
      spyOnProperty(authService, 'isLoggedIn').and.returnValue(of(false));
      authGuard = new AuthGuard(authService, router);
      authGuard.canActivateChild(null, router.routerState.snapshot)
        .subscribe((canActivate: boolean) => expect(canActivate).toEqual(false));
      flush();
    }));

    it('should return true when user logged in', fakeAsync(() => {
      spyOnProperty(authService, 'isLoggedIn').and.returnValue(of(true));
      authGuard = new AuthGuard(authService, router);
      authGuard.canActivateChild(null, router.routerState.snapshot)
        .subscribe((canActivate: boolean) => expect(canActivate).toEqual(true));
    }));
  });
});
