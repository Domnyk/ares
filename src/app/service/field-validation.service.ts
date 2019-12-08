import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FieldValidationService {
  constructor() { }

  isInvalid(control: FormControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
