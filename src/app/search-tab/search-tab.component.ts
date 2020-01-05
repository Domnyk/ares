import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../model/recipe';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.scss']
})
export class SearchTabComponent implements OnInit, OnDestroy {

  public foundRecipes: Recipe[] = [];
  public shouldDisplayNoRecipesFoundMsg = false;
  private titleQuery: string = '';
  private unsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    combineLatest(
      this.route.data,
      this.route.queryParams,
    ).pipe(takeUntil(this.unsubscribe)
    ).subscribe(([data, params]) => {
      this.foundRecipes = data.foundRecipes;
      this.titleQuery = params.query;
      if (this.foundRecipes && this.foundRecipes.length === 0 && !!this.titleQuery) {
        this.shouldDisplayNoRecipesFoundMsg = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public showFoundRecipes(recipes: Recipe[]): void {
    this.foundRecipes = recipes;
    this.shouldDisplayNoRecipesFoundMsg = (this.foundRecipes.length === 0);
  }
}
