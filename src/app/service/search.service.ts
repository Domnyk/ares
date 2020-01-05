import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/recipe';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static SEARCH_URL = environment.apiUrl + environment.searchPath;

  constructor(private http: HttpClient) {
  }

  public findRecipes(searchParams: { [header: string]: string | string[] }): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(SearchService.SEARCH_URL, {params: searchParams});
  }
}
