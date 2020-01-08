import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, flatMap, map, tap} from 'rxjs/operators';
import {User} from '../model/user';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private static readonly CREATED_STATUS = 201;
  private static readonly BAD_REQUEST_STATUS = 400;
  private _isSignedUp = new BehaviorSubject<boolean>(false);

  private url = environment.apiUrl + environment.usersPath;
  constructor(private http: HttpClient) {
  }

  addUser(username: string,
          password: string,
          nickname: string,
          bio: string,
          email: string,
          name: string,
          surname: string
  ): Observable<boolean> {
    const user: User = this.makeUser(username, password, nickname, bio, email, name, surname);
    console.log(user);
    const httpOptions: { observe: 'response' } = {
      observe: 'response'
    };

    return this.http.post(this.url, user, httpOptions).pipe(
      map(this.parseSuccessfulResponse),
      catchError(this.parseErrorResponse),
      tap((resp: ParsedAuthResponse) => this.setIsSignedUp(resp)),
      flatMap(_ => this._isSignedUp)
    );
  }

  parseSuccessfulResponse(response: HttpResponse<object>): ParsedAuthResponse {
    const status = response.status;

    if (status === RegistrationService.CREATED_STATUS) {
      return {wasSignUpSuccessful: true};
    } else {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
      return {wasSignUpSuccessful: false};
    }
  }

  parseErrorResponse(response: HttpErrorResponse): Observable<ParsedAuthResponse> {
    const {status} = response;
    if (status !== RegistrationService.BAD_REQUEST_STATUS) {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
    }

    return of({wasSignUpSuccessful: false});
  }

  makeUser(username: string, password: string, nickname: string, bio: string,
           email: string, name: string, surname: string): User {

    const basic_info = {username, password, surname, name, email};

    return {
      basic_info, nickname, bio
    };
  }

  private setIsSignedUp(resp: ParsedAuthResponse) {
    const {wasSignUpSuccessful} = resp;
    if (wasSignUpSuccessful) {
      this._isSignedUp.next(true);
    } else {
      this._isSignedUp.next(false);
    }
  }
}

interface ParsedAuthResponse {
  wasSignUpSuccessful: boolean;
}
