import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Recipe} from '../model/recipe';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private static RECIPES_URL = 'https://recipes-app-apsi.herokuapp.com/recipes';

  constructor(private http: HttpClient) {
  }

  public findNewestRecipes(): Observable<Recipe[]> {
    // TODO replace with correct endpoint when it is available
    return this.http.get<Recipe[]>(RecipeService.RECIPES_URL);
  }

  public findRecipeByName(query: string): Observable<Recipe[]> {
    // TODO implement when searching API is specified
    return this.http.get<Recipe[]>(RecipeService.RECIPES_URL);
  }
}
