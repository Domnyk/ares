import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, flatMap, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Credentials} from '../model/credentials';
import {CurrentUser} from '../model/current-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly currentUserKey = 'currentUser';
  private static readonly OK_STATUS = 200;
  private static readonly BAD_REQUEST_STATUS = 400;
  private url = environment.apiUrl + environment.loginPath;

  constructor(private http: HttpClient) {
  }

  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): Observable<boolean> {
    if (environment.production === false) {
      this.logUserAsDeveloper();
    }

    return this._isLoggedIn;
  }

  private _currentUser = new BehaviorSubject<CurrentUser | null>(null);

  get currentUser(): Observable<CurrentUser | null> {
    const currentUserAsJson = localStorage.getItem(AuthService.currentUserKey);
    if (currentUserAsJson !== null) {
      this._currentUser.next(JSON.parse(currentUserAsJson));
    } else {
      this._currentUser.next(null);
    }

    return this._currentUser.asObservable();
  }

  login(username: string, password: string): Observable<boolean> {
    const credentials: Credentials = this.makeCredentials(username, password);
    const httpOptions: { observe: 'response' } = {
      observe: 'response'
    };

    return this.http.post(this.url, credentials, httpOptions).pipe(
      map(this.parseSuccessfulResponse),
      catchError(this.parseErrorResponse),
      tap((resp: ParsedAuthResponse) => this.createSessionIfLoginWasSuccessful(resp, credentials.username)),
      flatMap(_ => this._isLoggedIn)
    );
  }

  logout(): Observable<boolean> {
    localStorage.setItem(AuthService.currentUserKey, JSON.stringify(null));

    this._isLoggedIn.next(false);
    return this._isLoggedIn;
  }

  parseSuccessfulResponse(response: HttpResponse<object>): ParsedAuthResponse {
    const {status} = response;

    if (status === AuthService.OK_STATUS) {
      const respToken = (response.body as AuthResponse).token;
      const userId = (response.body as AuthResponse).id;
      return {wasLoginSuccessful: true, token: respToken, id: userId};
    } else {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
      return {wasLoginSuccessful: false};
    }
  }

  parseErrorResponse(response: HttpErrorResponse): Observable<ParsedAuthResponse> {
    const {status} = response;
    if (status !== AuthService.BAD_REQUEST_STATUS) {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
    }

    return of({wasLoginSuccessful: false});
  }

  createSessionIfLoginWasSuccessful(response: ParsedAuthResponse, username: string): void {
    const {wasLoginSuccessful, token, id} = response;
    if (wasLoginSuccessful === false) {
      return;
    } else if (token === undefined || token === null) {
      console.warn(`Token is ${token}  but \'wasLoginSuccessful\' is true. Assuming login failed`);
      return;
    } else if (id === undefined || id === null) {
      console.warn(`Id is ${id}  but \'wasLoginSuccessful\' is true. Assuming login failed`);
      return;
    }

    this._isLoggedIn.next(true);
    const currentUser: CurrentUser = {id, username, token};
    localStorage.setItem(AuthService.currentUserKey, JSON.stringify(currentUser));
  }

  makeCredentials(username: string, password: string): Credentials {
    return {username, password};
  }

  private logUserAsDeveloper(): void {
    if (environment.token === undefined || environment.token === null) {
      console.warn('Trying to log as developer but token is not defined. Canceling login attempt');
      return;
    }

    const currentUser: CurrentUser = {id: 97, username: 'developer', token: environment.token};
    localStorage.setItem(AuthService.currentUserKey, JSON.stringify(currentUser));
    this._isLoggedIn.next(true);
  }
}

interface ParsedAuthResponse {
  wasLoginSuccessful: boolean;
  token?: string;
  id?: number;
}

interface AuthResponse {
  token?: string;
  id?: number;
}
