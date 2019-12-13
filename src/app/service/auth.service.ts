import { Injectable } from '@angular/core';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Credentials } from '../model/credentials';
import { AuthResponse } from '../model/auth-response';
import { CurrentUser } from '../model/current-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly currentUserKey = 'currentUser';

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _currentUser = new BehaviorSubject<CurrentUser | null>(null);
  private url = environment.apiUrl + '/auth';

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

    if (status === 200) {
      const respToken = (response.body as AuthResponse).token;
      return { wasLoginSuccessful: true, token: respToken };
    } else {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
      return { wasLoginSuccessful: false };
    }
  }

  parseErrorResponse(response: HttpErrorResponse): Observable<ParsedAuthResponse> {
    const { status } = response;
    if (status !== 400) {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
    }

    return of({ wasLoginSuccessful: false });
  }

  createSessionIfLoginWasSuccessful(response: ParsedAuthResponse, username: string): void {
    const { wasLoginSuccessful, token } = response;
    if (wasLoginSuccessful === false) {
      return;
    } else if (token === undefined || token === undefined) {
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
    if (currentUserAsJson === null) {
      this._currentUser.next(null);
    } else {
      this._currentUser.next(JSON.parse(currentUserAsJson));
    }

    return this._currentUser;
  }

  get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn;
  }
}

interface ParsedAuthResponse {
  wasLoginSuccessful: boolean;
  token?: string;
}
