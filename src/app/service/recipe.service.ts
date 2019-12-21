import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Recipe} from '../model/recipe';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CurrentUser } from '../model/current-user';
import { Rating } from '../model/rating';
import {DictionaryService} from './dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private static readonly RECIPES_URL = environment.apiUrl + '/recipes';
  private static readonly RATINGS_URL = environment.apiUrl + '/ratings';

  constructor(private http: HttpClient, private auth: AuthService) {
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

  public addRating(score: number, recipeId: number): Observable<void> {
    return this.auth.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => this._addRating(score, recipeId, currentUser)),
    );
  }

  private _addRating(score: number, recipeId: number, currentUser: CurrentUser | null): Observable<never | void> {
    if (currentUser === null) {
      return throwError('User is not logged in. Rating won\'t be added.');
    }

    const rating: Rating = {
      user: currentUser.username,
      score,
      recipe: recipeId
    };

    return this.http.post(RecipeService.RATINGS_URL, rating).pipe(
      map(_ => { return; }) // Discard data form backend. We don't need them for now
    );
  }

  private createRecipeUrl(id: number): string {
    return RecipeService.RECIPES_URL + `/${id}`;
  }
}
