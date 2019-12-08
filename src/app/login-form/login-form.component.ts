import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { FieldValidationService } from '../service/field-validation.service';
import { AuthService } from '../service/auth.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  username: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  loginForm: FormGroup;

  loginInProgress = false;
  lastAttemptFailed = false;

  constructor(public fieldValidationService: FieldValidationService, private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  sendLoginReq(): void {
    this.loginInProgress = true;

    this.authService.login(this.username.value, this.password.value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((succeeded: boolean) => {
        if (succeeded) {
          // Set appropriate flags so that navigation bar would change
          this.router.navigate(['/profile']);
        } else {
          this.lastAttemptFailed = true;
        }

        this.loginInProgress = false;
      });
  }

  hide(): void {
    this.lastAttemptFailed = false;
  }
}
