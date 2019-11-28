import { Component, OnInit } from '@angular/core';
import {Recipe} from '../model/recipe';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  public newestRecipes: Recipe[] = [];

  constructor() { }

  ngOnInit() {
    this.newestRecipes = [{
      name: 'Sałatka z kurczaka z fetą i oliwkami',
      id: '123'
    }, {
      name: 'Ciasto marchewkowe z bakaliami',
      id: '1234'
    }];
  }

}
