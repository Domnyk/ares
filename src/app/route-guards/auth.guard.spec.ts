import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { Routes } from '@angular/router';

@Component({
  selector: 'app-mock-login',
  template: '<p>Mock Login</p>'
})
class MockLoginComponent { }

@Component({
  selector: 'app-mock-main',
  template: '<p>Mock Main</p>'
})
class MockMainComponent { }

describe('AuthGuard', () => {
  beforeEach(() => {
    const routes: Routes = [
      {
        path: '', canActivateChild: [AuthGuard], children: [
          { path: 'main', component: MockMainComponent }
        ]
      },
      { path: 'login', component: MockLoginComponent }
    ];

    TestBed.configureTestingModule({
      declarations: [MockMainComponent, MockLoginComponent],
      providers: [AuthGuard],
      imports: [RouterTestingModule.withRoutes(routes)]
    });
  });

  it('should instantiate', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('canActivateChild', () => {
    let authGuard: AuthGuard;
    let authService;
    let router: Router;
    let location: Location;

    beforeEach(() => {
      router = TestBed.get(Router);
      router.initialNavigation();

      location = TestBed.get(Location);
    });

    it('should redirect user to login page when user not logged in', fakeAsync(() => {
      authService = { isLoggedIn: false };
      authGuard = new AuthGuard(authService, router);

      authGuard.canActivateChild(null, router.routerState.snapshot);
      tick();

      expect(location.path()).toBe('/login');
    }));

    it('should return false when user not logged in', () => {
      authService = { isLoggedIn: false };
      authGuard = new AuthGuard(authService, router);

      expect(authGuard.canActivateChild(null, router.routerState.snapshot)).toEqual(false);
    });

    it('should return true when user logged in', () => {
      authService = { isLoggedIn: true };
      authGuard = new AuthGuard(authService, router);

      expect(authGuard.canActivateChild(null, router.routerState.snapshot)).toEqual(true);
    });
  });
});
