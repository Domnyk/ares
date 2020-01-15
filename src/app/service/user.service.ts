import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static USER_URL = environment.apiUrl + environment.usersPath;

  constructor(private http: HttpClient) {
  }

  public fetchUserInfo(userId: number): Observable<User> {
    return this.http.get<User>(this.createUserUrl(userId));
  }

  private createUserUrl(id: number): string {
    return UserService.USER_URL + `/${id}`;
  }
}
