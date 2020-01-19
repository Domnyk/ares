import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, Observable, Subscription, fromEvent, throwError, zip, of } from 'rxjs';
import { map, flatMap, tap, take, switchMap } from 'rxjs/operators';

import { Recipe } from '../model/recipe';
import { takeUntil } from 'rxjs/operators';
import {ActivatedRoute, Data, Router} from '@angular/router';
import { RecipeService } from '../service/recipe.service';
import { AuthService } from '../service/auth.service';
import { RecipeWithRating } from '../model/recipe-with-rating';
import { Rating } from '../model/rating';
import { CurrentUser } from '../model/current-user';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.scss']
})
export class ShowRecipeComponent implements OnInit, OnDestroy {
  public recipe: Recipe | null = null;
  public rating: number | null = null;
  public isRatingConfirmationVisible = false;
  public showAlert = false;

  private unsubscribe = new Subject<void>();

  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute,
              private route: Router, private auth: AuthService) {}

  ngOnInit() {
    this.activatedRoute.data.pipe(
      map((res: Data) => res.recipe.id),
      map((id: string) => parseInt(id, 10)),
      flatMap((id: number) => this.fetchRecipeAndRating(id)),
      takeUntil(this.unsubscribe),
    ).subscribe(({ recipe, rating }) => { this.recipe = recipe; this.rating = rating.score; });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleRatingClick(newRating: number): void {
    this.isRatingConfirmationVisible = true;
    this.rating = newRating;
  }

  updateRating(): void {
    if (this.rating === null || this.recipe === null || this.recipe.id === undefined) {
      console.error(`Update rating was canceled because rating ${this.rating} or recipe ${this.recipe} is null or it` +
                    `is missing id`);
      return;
    }

    this.recipeService.addRating(this.rating, this.recipe.id).pipe(
      take(1),
      takeUntil(this.unsubscribe),
    ).subscribe(_ => { this.showAlert = true; });
  }

  hide() {
    this.showAlert = false;
  }

  private fetchRecipeAndRating(recipeId: number): Observable<RecipeWithRating> {
    return zip(this.fetchRecipe(recipeId), this.fetchRating(recipeId)).pipe(
      map(([recipe, rating]: [Recipe, Rating]) => ({ recipe, rating }))
    );
  }

  private fetchRecipe(id: number): Observable<Recipe> {
    return this.recipeService.findRecipeById(id);
  }

  private fetchRating(recipeId: number): Observable<Rating> {
    const errorMsg = 'Tried to fetch rating but currentUser is null - is user logged in?';

    return this.auth.currentUser.pipe(
      take(1),
      flatMap((cu: CurrentUser | null) => cu === null ? throwError(errorMsg) : of(cu)),
      flatMap((cu: CurrentUser) => this.recipeService.fetchRating(recipeId, cu.username))
    );
  }

  routeToEditor() {
    if (this.recipe !== null) {
    this.route.navigate(['/recipe-editor'], {state: this.recipe});
    }
  }
}
