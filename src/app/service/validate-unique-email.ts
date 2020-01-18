import { RegistrationService } from './registration.service';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';

export class ValidateUniqueEmail {
  static createValidator(registrationService: RegistrationService) {
    return (control: AbstractControl) => {
      return registrationService.isEmailUnique(control.value).pipe(
        map((isUnique: boolean) => isUnique ? null : {emailTaken: true}));
    };
  }
}
