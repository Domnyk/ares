import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../model/recipe';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input() public recipe: Recipe;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // TODO implement me
  public navigateToRecipe(): void {
      this.router.navigateByUrl('profile');
  }
}
