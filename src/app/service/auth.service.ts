import { Injectable } from '@angular/core';
import { timer, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;

  constructor() { }

  login(username: string, password: string): Observable<boolean> {
    return timer(2000).pipe(
      tap(_ => this._isLoggedIn = true),
      map(_ => true)
    );
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
}
