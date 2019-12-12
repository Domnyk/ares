import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, timer} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  login(username: string, password: string): Observable<boolean> {
    return timer(2000).pipe(
      tap(_ => this._isLoggedIn.next(true)),
      map(_ => true)
    );
  }

  get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn;
  }
}
