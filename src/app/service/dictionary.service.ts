import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/recipe';
import {Observable} from 'rxjs';
import {Ingredient} from '../model/ingredient';
import {Category} from '../model/category';


@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  private static INGREDIENTS_URL = environment.apiUrl + environment.ingredientsPath;
  private static CATEGORIES_URL = environment.apiUrl + environment.categoriesPath;

  constructor(private http: HttpClient) {
  }

  getIngredients(term: string): Observable<Ingredient[]> {
    const params = {search: term};
    return this.http.get<Ingredient[]>(DictionaryService.INGREDIENTS_URL, {params});
  }

  getCategories(term: string): Observable<Category[]> {
    const params = {search: term};
    return this.http.get<Category[]>(DictionaryService.CATEGORIES_URL, {params});
  }
}
