import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { Recipe } from '../model/recipe';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Data } from '@angular/router';
import { RecipeService } from '../service/recipe.service';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.scss']
})
export class ShowRecipeComponent implements OnInit, OnDestroy {
  public recipe: Recipe | null = null;
  public isRatingConfirmationVisible = false;

  private unsubscribe = new Subject<void>();

  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.pipe(
      map((res: Data) => res.recipe.id),
      map((id: string) => parseInt(id, 10)),
      map((id: number) => this.fetchRecipe(id)),
      flatMap(_ => _),
      takeUntil(this.unsubscribe),
    ).subscribe(recipe => this.recipe = recipe);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  showRatingConfirmation(): void {
    this.isRatingConfirmationVisible = true;
  }

  updateRating(): void {

  }

  private fetchRecipe(id: number): Observable<Recipe> {
    return this.recipeService.findRecipeById(id).pipe(
      takeUntil(this.unsubscribe)
    );
  }

}
