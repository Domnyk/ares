import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {Router, Routes} from '@angular/router';
import {Location} from '@angular/common';
import {Observable, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../service/auth.service';

import {LoginFormComponent} from './login-form.component';

@Component({
  selector: 'app-mock-profile',
  template: '<p>Mock Profile</p>'
})
class MockProfileComponent {
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let submitBtn: HTMLButtonElement;
  let usernameField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let warning: HTMLDivElement;
  let location: Location;
  let router: Router;
  let desiredAuthResult: boolean;
  const initFields = () => {
    submitBtn = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    usernameField = fixture.debugElement.query(By.css('input#username')).nativeElement;
    passwordField = fixture.debugElement.query(By.css('input#password')).nativeElement;
  };
  const routes: Routes = [
    {path: 'profile', component: MockProfileComponent}
  ];
  const authDelay = 2000;
  const authService = {
    login(u, p): Observable<boolean> {
      return timer(authDelay).pipe(
        map(_ => desiredAuthResult)
      );
    }
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormComponent, MockProfileComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [{provide: AuthService, useValue: authService}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Submit button', () => {
    beforeEach(initFields);

    it('should be disabled when form is not valid', () => {
      usernameField.value = '';
      passwordField.value = '';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.loginForm.valid).toBe(false);
      expect(submitBtn.disabled).toBe(true);
    });

    it('should be enabled when form is valid', () => {
      usernameField.value = 'john';
      passwordField.value = 'my very secret password';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.loginForm.valid).toBe(true);
      expect(submitBtn.disabled).toBe(false);
    });

    it('should be disabled when login in progress', fakeAsync(() => {
      usernameField.value = 'john';
      passwordField.value = 'my very secret password';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      submitBtn.click();
      fixture.detectChanges();
      expect(submitBtn.disabled).toEqual(true);

      tick(authDelay);
      fixture.detectChanges();
      expect(submitBtn.disabled).toEqual(false);
    }));
  });

  describe('Wrong username or password warning', () => {
    beforeEach(initFields);

    it('should be displayed when wrong login or password', fakeAsync(() => {
      desiredAuthResult = false;
      usernameField.value = 'wrong user';
      passwordField.value = 'wrong password';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      submitBtn.click();
      fixture.detectChanges();
      tick(authDelay);
      fixture.detectChanges();

      warning = fixture.debugElement.query(By.css('div[role=alert]')).nativeElement;
      expect(warning).toBeTruthy();
    }));

    it('should disappear when \'X\' is clicked', fakeAsync(() => {
      component.lastAttemptFailed = true;
      fixture.detectChanges();
      const closeWarningBtn = fixture.debugElement.query(By.css('div[role=alert]')).query(By.css('button')).nativeElement;

      closeWarningBtn.click();
      fixture.detectChanges();

      const warningDe = fixture.debugElement.query(By.css('div[role=alert]'));
      expect(warningDe).toBeNull();
    }));
  });

  describe('Login in progress message', () => {
    beforeEach(initFields);

    it('should be displayed after form is submitted', () => {
      usernameField.value = 'john';
      passwordField.value = 'my very secret password';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      submitBtn.click();
      fixture.detectChanges();

      warning = fixture.debugElement.query(By.css('div#loginInProgressWarning')).nativeElement;
      expect(warning).toBeTruthy();
    });

    it('should hide when login result is available', fakeAsync(() => {
      usernameField.value = 'john';
      passwordField.value = 'my very secret password';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      submitBtn.click();
      fixture.detectChanges();
      warning = fixture.debugElement.query(By.css('div#loginInProgressWarning')).nativeElement;
      expect(warning).toBeTruthy();

      tick(5000);
      fixture.detectChanges();
      const warningDe = fixture.debugElement.query(By.css('div#loginInProgressWarning'));
      expect(warningDe).toBeNull();
    }));
  });

  describe('Redirection', () => {
    beforeEach(initFields);

    it('should redirect to profile page when login is successful', fakeAsync(() => {
      desiredAuthResult = true;
      usernameField.value = 'john';
      passwordField.value = 'my very secret password';
      usernameField.dispatchEvent(new Event('input'));
      passwordField.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      submitBtn.click();
      tick(authDelay);

      expect(location.path()).toBe('/profile');
    }));
  });
});
