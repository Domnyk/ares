import { Injectable } from '@angular/core';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, flatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Credentials } from '../model/credentials';
import { AuthResponse } from '../model/auth-response';
import { CurrentUser } from '../model/current-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly currentUserKey = 'currentUser';

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private url = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    const credentials: Credentials = this.makeCredentials(username, password);
    const httpOptions: { observe: 'response' } = {
      observe: 'response'
    };

    return this.http.post(this.url, credentials, httpOptions).pipe(
      map(this.parseResponse),
      tap((resp: ParsedAuthResponse) => this.createSessionIfLoginWasSuccessful(resp, credentials.username)),
      flatMap(_ => this._isLoggedIn)
    );
  }

  logout(): Observable<boolean> {
    localStorage.setItem(AuthService.currentUserKey, null);

    this._isLoggedIn.next(false);
    return this._isLoggedIn;
  }

  parseResponse(response: HttpResponse<object>): ParsedAuthResponse {
    const { status } = response;

    if (status === 200) {
      const respToken = (response.body as AuthResponse).token;

      return { wasLoginSuccessful: true, token: respToken };
    } else if (status === 400) {
      return { wasLoginSuccessful: false };
    } else {
      console.warn(`Unexpected status code ${status}. Assuming login failed. Full response: ${response}`);
      return { wasLoginSuccessful: false };
    }
  }

  createSessionIfLoginWasSuccessful(response: ParsedAuthResponse, username: string): void {
    const wasLoginSuccessful = response.wasLoginSuccessful;
    const t = response.token;

    if (wasLoginSuccessful === false) {
      return;
    }

    this._isLoggedIn.next(true);
    const currentUser: CurrentUser = { username: '', token: t };
    localStorage.setItem(AuthService.currentUserKey, JSON.stringify(currentUser));
  }

  makeCredentials(username: string, password: string): Credentials {
    const u = username;
    const p = password;

    return { username: u, password: p };
  }

  get currentUser(): CurrentUser | null {
    const currentUserAsJson = localStorage.getItem(AuthService.currentUserKey);
    return JSON.parse(currentUserAsJson);
  }

  get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn;
  }
}

interface ParsedAuthResponse {
  wasLoginSuccessful: boolean;
  token?: string;
}
