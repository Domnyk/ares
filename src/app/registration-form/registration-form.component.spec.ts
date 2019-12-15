import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegistrationFormComponent} from './registration-form.component';
import {Component} from "@angular/core";
import {LoginFormComponent} from "../login-form/login-form.component";
import {Location} from "@angular/common";
import {Router, Routes} from "@angular/router";
import {By} from "@angular/platform-browser";
import {Observable, timer} from "rxjs";
import {map} from "rxjs/operators";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-mock-profile',
  template: '<p>Mock Profile</p>'
})
class MockMainPageComponent {
}

describe('RegistrationFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let submitBtn: HTMLButtonElement;
  let usernameField: HTMLInputElement;
  let passwordField: HTMLInputElement;
  let nicknameField: HTMLInputElement;
  let emailField: HTMLInputElement;
  let warning: HTMLDivElement;
  let location: Location;
  let router: Router;
  let desiredAuthResult: boolean;
  const initFields = () => {
    submitBtn = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
    usernameField = fixture.debugElement.query(By.css('input#username')).nativeElement;
    nicknameField = fixture.debugElement.query(By.css('input#nickname')).nativeElement;
    emailField = fixture.debugElement.query(By.css('input#email')).nativeElement;
    passwordField = fixture.debugElement.query(By.css('input#password')).nativeElement;
  };
  const routes: Routes = [
    {path: '/login', component: MockMainPageComponent}
  ];
  const authDelay = 2000;
  const registrationService = {
    addUser(u, p, n, b, f, e, nm, sm): Observable<boolean> {
      return timer(authDelay).pipe(
        map(_ => desiredAuthResult)
      );
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormComponent, MockMainPageComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, RouterTestingModule.withRoutes(routes)],
      providers: [{provide: AuthService, useValue: registrationService}]
    })
      .compileComponents();
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
