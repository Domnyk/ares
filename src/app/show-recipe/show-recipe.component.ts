import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, Observable, Subscription, fromEvent, throwError } from 'rxjs';
import { map, flatMap, tap, take, switchMap } from 'rxjs/operators';

import { Recipe } from '../model/recipe';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Data } from '@angular/router';
import { RecipeService } from '../service/recipe.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.scss']
})
export class ShowRecipeComponent implements OnInit, OnDestroy {
  public recipe: Recipe | null = null;
  public isRatingConfirmationVisible = false;
  public showAlert = false;

  private unsubscribe = new Subject<void>();
  private rating: number | null = null;

  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    this.activatedRoute.data.pipe(
      map((res: Data) => res.recipe.id),
      map((id: string) => parseInt(id, 10)),
      flatMap((id: number) => this.fetchRecipe(id)),
      takeUntil(this.unsubscribe),
    ).subscribe(recipe => this.recipe = recipe);
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
    if (this.rating === null || this.recipe === null) {
      console.error(`Update rating was canceled because rating ${this.rating} or recipe ${this.recipe} is null`);
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

  private fetchRecipe(id: number): Observable<Recipe> {
    return this.recipeService.findRecipeById(id);
  }
}
