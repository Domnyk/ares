import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../model/recipe';
import {Observable} from 'rxjs';
import {Ingredient} from '../model/ingredient';
import {Category} from '../model/category';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  private static INGREDIENTS_URL = environment.apiUrl + environment.ingredientsPath;
  private static CATEGORIES_URL = environment.apiUrl + environment.categoriesPath;

  constructor(private http: HttpClient) {
  }

  searchCategoriesNames(selectedCategories: string[]): (text: Observable<string>) => Observable<string[]> {
    return (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getCategoriesNames(term, selectedCategories)
        ));
  }

  searchIngredientsNames(selectedIngredients: string[]): (text: Observable<string>) => Observable<string[]> {
    return (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getIngredientsNames(term, selectedIngredients)
        ));
  }

  searchIngredients(selectedIngredients: Ingredient[]): (text: Observable<string>) => Observable<string[]> {
    return (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => this.getIngredients(term, selectedIngredients)
        ));
  }


  getIngredientsNames(term: string,  selectedIngredients: string[]): Observable<string[]> | [] {
    return term.length < 2 ? []
      : this.requestIngredients(term).pipe(
        map((ingredients: Ingredient[]) =>
          ingredients.map((ingredient: Ingredient) => ingredient.name)
            .filter((ingredient: string) => !selectedIngredients.includes(ingredient))));
  }

  getIngredients(term: string,  selectedIngredients: Ingredient[]): Observable<string[]> | [] {
    return this.requestIngredients(term).pipe(
      map((ingredients: Ingredient[]) =>
        ingredients.
        filter((ingredient: Ingredient) => !selectedIngredients.includes(ingredient))
          .map((ingredient: Ingredient) => JSON.stringify(ingredient))));
  }

  getCategoriesNames(term: string, selectedCategories: string[]): Observable<string[]> | [] {
    return this.requestCategories(term).pipe(
      map((categories: Category[]) =>
        categories.map((category: Category) => category.name)
          .filter((category: string) => !selectedCategories.includes(category))));
  }

  requestIngredients(term: string): Observable<Ingredient[]> {
    const params = {search: term};
    return this.http.get<Ingredient[]>(DictionaryService.INGREDIENTS_URL, {params});
  }

  requestCategories(term: string): Observable<Category[]> {
    const params = {search: term};
    return this.http.get<Category[]>(DictionaryService.CATEGORIES_URL, {params});
  }
}
