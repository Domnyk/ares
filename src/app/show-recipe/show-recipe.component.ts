import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../model/recipe';
import { Ingredient } from '../model/ingredient';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-recipe',
  templateUrl: './show-recipe.component.html',
  styleUrls: ['./show-recipe.component.scss']
})
export class ShowRecipeComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();

  public recipe: Recipe | null = null;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe((res) => console.log(res));
  }

  ngOnInit() {
    timer(1000).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(_ => this.recipe = this.makeDumbRecipe());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private makeDumbRecipe(): Recipe {
    const ingredients: Ingredient[] = [{
      id: 1,
      replacements: [],
      name: 'butter'
    }, {
      id: 2,
      replacements: [],
      name: 'eggs'
    }];

    return {
      id: '-1',
      categories: ['dinner', 'expensive', 'fancy', 'perfect for group'],
      ingredients,
      title: 'Student\'s chicken',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at efficitur enim. ' +
        'Maecenas ac risus vitae nibh varius auctor a id ex.Pellentesque habitant morbi tristique ' +
        'senectus netus et malesuada fames ac turpis egestas.Fusce tortor nisi, lacinia non semper non, commodo id ' +
        'nibh.Nunc vestibulum maximus ipsum id gravida.Mauris at elit vehicula, faucibus quam et, pharetra augue.',
      difficulty: 10,
      creationDate: new Date(),
      time: 3600,
      user: -1
    };
  }

}
