import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FieldValidationService} from '../service/field-validation.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {RegistrationService} from '../service/registration.service';
import {takeUntil} from 'rxjs/operators';
import { ValidateUniqueEmail } from '../service/validate-unique-email';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnDestroy {
  nickname: FormControl = new FormControl('', [Validators.required]);
  username: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  bio: FormControl = new FormControl('', [Validators.nullValidator]);
  email: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ], [ValidateUniqueEmail.createValidator(this.registrationService)]);
  // TODO add posibility to type and search
  name: FormControl = new FormControl('', [Validators.nullValidator]);
  surname: FormControl = new FormControl('', [Validators.nullValidator]);
  registrationForm: FormGroup;
  lastAttemptFailed: boolean | null = null;
  private unsubscribe = new Subject<void>();

  constructor(public fieldValidationService: FieldValidationService, private registrationService: RegistrationService,
              private formBuilder: FormBuilder, private router: Router) {
    this.registrationForm = this.formBuilder.group({
      nickname: this.nickname,
      username: this.username,
      password: this.password,
      bio: this.bio,
      email: this.email,
      name: this.name,
      surname: this.surname
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  sendRegistrationReq(): void {
    this.registrationService.addUser(
      this.username.value,
      this.password.value,
      this.nickname.value,
      this.bio.value,
      this.email.value,
      this.name.value,
      this.surname.value
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((succeeded: boolean) => {
         this.lastAttemptFailed = !succeeded;
      });
  }

  moveToLogin(): void {
    this.router.navigate(['/login']);
  }
  hide(): void {
    this.lastAttemptFailed = false;
  }
}
