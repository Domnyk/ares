import {Injectable} from '@angular/core';
import {Observable, of, throwError, EMPTY} from 'rxjs';
import {Recipe} from '../model/recipe';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
]import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CurrentUser, CurrentUserDto } from '../model/current-user';
import { Rating } from '../model/rating';
import { FavouriteRecipe } from '../model/favourite-recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private static readonly USERS_URL = environment.apiUrl + '/users';
  private static readonly FAVOURITES_URL = environment.apiUrl + '/favourite_recipe';
  private static readonly RECIPES_URL = environment.apiUrl + '/recipes';
  private static readonly RATINGS_URL = environment.apiUrl + '/ratings';
  private static readonly NEWEST_RECIPES_NUMBER = '5';


  constructor(private http: HttpClient, private auth: AuthService) {
  }

  public findNewestRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(RecipeService.RECIPES_URL, {params: {amount: RecipeService.NEWEST_RECIPES_NUMBER}});
  }

  public findRecipeById(id: number): Observable<Recipe> {
    // TODO throw error if recipe not found
    return this.http.get<Recipe>(this.createRecipeUrl(id));
  }

  public addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(RecipeService.RECIPES_URL, recipe).pipe(
      tap((newRecipe: Recipe) => console.log(`added recipe w/ id=${newRecipe.id}`)),
      catchError(this.handleError<Recipe>('addRecipe'))
    );
  }

  public addToFavourites(recipeId?: number): Observable<FavouriteRecipe> {
    if (recipeId === undefined) {
      console.warn('Missing recipeId, skipping');
      return EMPTY;
    }

    return this.auth.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => this._addToFavourites(recipeId, currentUser)),
    );
  }

  public fetchFavourites(): Observable<number[]> {
    return this.auth.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => this._fetchFavourites(currentUser)),
    );
  }

  private _fetchFavourites(currentUser: CurrentUser | null): Observable<number[]> {
    if (currentUser == null) {
      return throwError('currentUser is null. Skipping fetch of favourites recipes');
    }

    return this.http.get<CurrentUserDto>(this.createUserUrl(currentUser.id)).pipe(
      map((resp: CurrentUserDto) => resp.favourite_recipes),
      map((favourites: Array<{id: number}>) => favourites.map(f => f.id)),
    );
  }

  private _addToFavourites(recipeId: number, currentUser: CurrentUser | null): Observable<FavouriteRecipe> {
    if (currentUser == null) {
      return throwError('CurrentUser is null. Skipping add to favourites');
    }

    const favouriteRecipe: FavouriteRecipe = { recipe_id: recipeId, user_id: currentUser.id };
    return this.http.post<FavouriteRecipe>(RecipeService.FAVOURITES_URL, favouriteRecipe);
  }

  public addToFavourites(recipeId?: number): Observable<FavouriteRecipe> {
    if (recipeId === undefined) {
      console.warn('Missing recipeId, skipping');
      return EMPTY;
    }

    return this.auth.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => this._addToFavourites(recipeId, currentUser)),
    );
  }

  public fetchFavourites(): Observable<number[]> {
    return this.auth.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => this._fetchFavourites(currentUser)),
    );
  }

  private _fetchFavourites(currentUser: CurrentUser | null): Observable<number[]> {
    if (currentUser == null) {
      return throwError('currentUser is null. Skipping fetch of favourites recipes');
    }

    return this.http.get<CurrentUserDto>(this.createUserUrl(currentUser.id)).pipe(
      map((resp: CurrentUserDto) => resp.favourite_recipes),
      map((favourites: Array<{id: number}>) => favourites.map(f => f.id)),
    );
  }

  private _addToFavourites(recipeId: number, currentUser: CurrentUser | null): Observable<FavouriteRecipe> {
    if (currentUser == null) {
      return throwError('CurrentUser is null. Skipping add to favourites');
    }

    const favouriteRecipe: FavouriteRecipe = { recipe_id: recipeId, user_id: currentUser.id };
    return this.http.post<FavouriteRecipe>(RecipeService.FAVOURITES_URL, favouriteRecipe);
  }

  public addRating(score: number, recipeId: number): Observable<void> {
    return this.auth.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => this._addRating(score, recipeId, currentUser)),
    );
  }

  changeRecipe(id: number, newRecipe: Recipe) {
    return this.http.put<Recipe>(RecipeService.RECIPES_URL + '/' + id, newRecipe).pipe(
      tap((recipe: Recipe) => console.log(`changed recipe w/ id=${recipe.id}`)),
      catchError(this.handleError<Recipe>('changeRecipe'))
    );
  }

  deleteRecipe(id: number): Observable<boolean> {
    return this.http.delete(RecipeService.RECIPES_URL + '/' + id)
      .pipe(
        map(() => {
          console.log(`removed recipe w/ id=${id}`);
          return true;
        }),
        catchError(this.handleError<any>('deleteRecipe'))
      );
  }

  public fetchRating(recipeId: number, username: string): Observable<Rating> {
    const params = new HttpParams().set('recipe_id', recipeId.toString()).set('username', username);

    return this.http.get<Rating[]>(RecipeService.RATINGS_URL, { params }).pipe(
      map((ratings: Rating[]) => ratings[0])
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
      map(_ => {
        return;
      }) // Discard data form backend. We don't need them for now
    );
  }

  private createRecipeUrl(id: number): string {
    return RecipeService.RECIPES_URL + `/${id}`;
  }

  private createUserUrl(id: number): string {
    return RecipeService.USERS_URL + `/${id}`;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
