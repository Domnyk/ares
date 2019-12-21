import { Injectable } from '@angular/core';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Credentials } from '../model/credentials';
import { CurrentUser } from '../model/current-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly currentUserKey = 'currentUser';
  private static readonly OK_STATUS = 200;
  private static readonly BAD_REQUEST_STATUS = 400;

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _currentUser = new BehaviorSubject<CurrentUser | null>(null);
  private url = environment.apiUrl + environment.loginPath;

  constructor(private http: HttpClient) { }

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
    const { status } = response;

    if (status === AuthService.OK_STATUS) {
      const respToken = (response.body as AuthResponse).token;
      return { wasLoginSuccessful: true, token: respToken };
    } else {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
      return { wasLoginSuccessful: false };
    }
  }

  parseErrorResponse(response: HttpErrorResponse): Observable<ParsedAuthResponse> {
    const { status } = response;
    if (status !== AuthService.BAD_REQUEST_STATUS) {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
    }

    return of({ wasLoginSuccessful: false });
  }

  createSessionIfLoginWasSuccessful(response: ParsedAuthResponse, username: string): void {
    const { wasLoginSuccessful, token } = response;
    if (wasLoginSuccessful === false) {
      return;
    } else if (token === undefined || token === null) {
      console.warn(`Token is ${token}  but \'wasLoginSuccessful\' is true. Assuming login failed`);
      return;
    }

    this._isLoggedIn.next(true);
    const currentUser: CurrentUser = { username, token };
    localStorage.setItem(AuthService.currentUserKey, JSON.stringify(currentUser));
  }

  makeCredentials(username: string, password: string): Credentials {
    return { username, password };
  }

  get currentUser(): Observable<CurrentUser | null> {
    const currentUserAsJson = localStorage.getItem(AuthService.currentUserKey);
    if (currentUserAsJson !== null) {
      this._currentUser.next(JSON.parse(currentUserAsJson));
    } else {
      this._currentUser.next(null);
    }

    return this._currentUser;
  }

  get isLoggedIn(): Observable<boolean> {
    if (environment.production === false) {
      this.logUserAsDeveloper();
    }

    return this._isLoggedIn;
  }

  private logUserAsDeveloper(): void {
<<<<<<< HEAD
    const currentUser: CurrentUser = { username: 'Developer', token: '4f41d4daecaf901826b467c5ad2e2683f82a0519' };
=======
    if (environment.token === undefined || environment.token === null) {
      console.warn('Trying to log as developer but token is not defined. Canceling login attempt');
      return;
    }

    const currentUser: CurrentUser = { username: 'Developer', token: environment.token };
>>>>>>> staging
    localStorage.setItem(AuthService.currentUserKey, JSON.stringify(currentUser));
    this._isLoggedIn.next(true);
  }
}

interface ParsedAuthResponse {
  wasLoginSuccessful: boolean;
  token?: string;
}

interface AuthResponse {
  token?: string;
}
