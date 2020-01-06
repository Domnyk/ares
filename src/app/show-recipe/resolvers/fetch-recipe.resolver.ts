import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Recipe } from '../../model/recipe';
import { RecipeService } from 'src/app/service/recipe.service';

@Injectable()
export class FetchRecipeResolver implements Resolve<Recipe> {
  constructor(private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> | Promise<Recipe> | Recipe {
    const idAsString = route.paramMap.get('id');
    if (idAsString === null) {
      console.error(`Param 'id' could not be found in route paramMap.`);
      return throwError(`Param 'id' could not be found in route paramMap.`);
    }

    const id: number = parseInt(idAsString, 10);
    if (isNaN(id)) {
      console.error(`Could not parse ${idAsString} as recipe id`);
      return throwError(`Could not parse ${idAsString} as recipe id`);
    }

    return this.recipeService.findRecipeById(id).pipe(
      first()
    );
  }
}
