import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../model/recipe';
import {ActivatedRoute, Data, Params} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.scss']
})
export class SearchTabComponent implements OnInit, OnDestroy {

  public foundRecipes: Recipe[] = [];
  private titleQuery: string = '';
  private unsubscribe = new Subject<void>();

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((data: Data) => this.foundRecipes = data.foundRecipes);

    this.route.queryParams.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((params: Params) => this.titleQuery = params.query);

  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
