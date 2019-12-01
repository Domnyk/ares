import { Component, OnInit } from '@angular/core';
import {Recipe} from '../model/recipe';
import {RecipeService} from '../service/recipe.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  public newestRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.findNewestRecipes()
      .subscribe((recipes: Recipe[]) => this.newestRecipes = recipes);
  }

}
