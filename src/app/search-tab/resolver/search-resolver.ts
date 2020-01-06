import {map, take} from 'rxjs/operators';
import {Recipe} from '../../model/recipe';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {SearchService} from '../../service/search.service';

@Injectable()
export class SearchResolver implements Resolve<Recipe[]> {

  constructor(private searchService: SearchService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> {
    const query = route.queryParams.query;
    return !!query ? this.searchService.findRecipes({title: query}).pipe(
      map((recipes: Recipe[]) => {
        if (recipes.length !== 1) {
          return recipes;
        } else {
          this.router.navigateByUrl('/recipes\/' + recipes[0].id);
          return [];
        }
      }),
      take(1)) : of([]);
  }
}
