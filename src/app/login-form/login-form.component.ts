import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FieldValidationService } from '../service/field-validation.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
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

  sendLoginReq() {
    this.loginInProgress = true;

    this.authService.login(this.username.value, this.password.value).subscribe((succeeded: boolean) => {
      if (succeeded) {
        // Set appropriate flags so that navigation bar would change
        this.router.navigate(['/profile']);
      } else {
        this.lastAttemptFailed = true;
      }

      this.loginInProgress = false;
    });
  }

  hide() {
    this.lastAttemptFailed = false;
  }
}
