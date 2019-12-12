import {map, takeUntil} from 'rxjs/operators';
import {Recipe} from '../../model/recipe';
import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {RecipeService} from '../../service/recipe.service';

@Injectable()
export class SearchResolver implements OnDestroy, Resolve<Recipe[]> {

  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private recipeService: RecipeService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> {
    const query = route.queryParams.query;
    return this.recipeService.findRecipeByName(query).pipe(
      takeUntil(this.unsubscribe),
      map((recipes: Recipe[]) => {
        if (recipes.length !== 1) {
          return recipes;
          // TODO think what to do when nothing found (return to main or to search page)
        } else {
          // TODO redirect to recipe page when available, figure out how to pass recipe data (another request or store)
          this.router.navigateByUrl('profile');
          return [];
        }
      }));
  }


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
