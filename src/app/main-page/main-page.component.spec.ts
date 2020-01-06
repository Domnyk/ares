import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageComponent} from './main-page.component';
import {TranslateModule} from '@ngx-translate/core';
import {RecipeService} from '../service/recipe.service';
import {SearchResultComponent} from '../shared/search-result/search-result.component';
import {SearchBoxComponent} from './search-box/search-box.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageComponent, SearchResultComponent, SearchBoxComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule, RouterTestingModule],
      providers: [
        RecipeService,
        HttpClient      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
