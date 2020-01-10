import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ValidationResp } from '../model/validation-resp';
import { map, delay, tap } from 'rxjs/operators';
import { ValidationErrors, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidationService {

  private static readonly EMAIL_VALIDATION_ENDPOINT = environment.apiUrl + '/validations/email';

  constructor(private http: HttpClient) { }

  uniqueEmail(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    // return this.http.post<ValidationResp>(AsyncValidationService.EMAIL_VALIDATION_ENDPOINT, ctrl.value).pipe(
    //   map((resp: ValidationResp) => resp.valid),
    //   map(isUnique => (isUnique ? null : { alreadyTaken: true })),
    // );

    return of(ctrl.value).pipe(
      delay(1000),
      map(_ => false),
      map(isUnique => (isUnique ? null : { alreadyTaken: true })),
    );
  }
}
