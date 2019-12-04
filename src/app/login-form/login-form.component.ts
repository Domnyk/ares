import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { timer } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  username: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
  }

  get f() { return this.loginForm.controls; }

  ngOnInit() {
  }

  sendLoginReq() {
    timer(1000).subscribe(_ => console.log('Receiving resp'));
  }
}
