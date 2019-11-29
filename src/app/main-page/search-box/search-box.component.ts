import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  public search(recipeTitle: string): void {
    this.router.navigate(['search'], {queryParams: { query: recipeTitle }});
  }

}
