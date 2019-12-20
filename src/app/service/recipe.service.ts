import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Recipe} from '../model/recipe';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private static readonly RECIPES_URL = environment.apiUrl + '/recipes';

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

  public findRecipeById(id: number): Observable<Recipe> {
    // TODO throw error if recipe not found
    return this.http.get<Recipe>(this.createRecipeUrl(id));
  }

  private createRecipeUrl(id: number): string {
    return RecipeService.RECIPES_URL + `/${id}`;
  }
}
