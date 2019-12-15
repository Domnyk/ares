import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FieldValidationService} from "../service/field-validation.service";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {RegistrationService} from "../service/registration.service";
import {takeUntil} from "rxjs/operators";


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  nickname: FormControl = new FormControl('', [Validators.required]);
  username: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  bio: FormControl = new FormControl('', [Validators.nullValidator]);
  // favourite_recipes: {id:number,recipe:number}[];
  email: FormControl = new FormControl('', [Validators.required]);
  //TODO add posibility to type and search
  name: FormControl = new FormControl('', [Validators.nullValidator]);
  surname: FormControl = new FormControl('', [Validators.nullValidator]);
  registrationForm: FormGroup;
  lastAttemptFailed = false;
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

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  sendRegistrationReq(): void {
    //TODO
    // real recipes are required here
    let recipes = [4];
    this.registrationService.addUser(
      this.username.value,
      this.password.value,
      this.nickname.value,
      this.bio.value,
      recipes,
      this.email.value,
      this.name.value,
      this.surname.value
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((succeeded: boolean) => {
        if (succeeded) {
          this.router.navigate(['/login']);
        } else {
          this.lastAttemptFailed = true;
        }
      });
  }

  hide(): void {
    this.lastAttemptFailed = false;
  }
}
