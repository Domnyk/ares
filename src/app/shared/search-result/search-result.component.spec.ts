import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchResultComponent} from './search-result.component';
import {TranslateModule} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import { Recipe } from 'src/app/model/recipe';
import { By } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";

describe('SearchResultComponent', () => {
  const recipe: Recipe = {
    id: 1,
    categories: ['A', 'B', 'C'],
    ingredients: [{ id: 1, replacements: ['cow milk'], name: 'goat milk'}, { id: 2, replacements: ['beef'], name: 'chicken'}],
    title: 'My awesome dinner',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam viverra libero odio, vel tristique urna viverra eu.',
    difficulty: 5,
    creationDate: new Date(),
    time: 10,
    user: 1,
  };

  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultComponent],
      imports: [HttpClientModule,TranslateModule.forRoot(), RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    component.recipe = recipe;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should contain link', () => {
    const link = fixture.debugElement.query(By.css('a')).nativeElement as HTMLLinkElement;

    expect(link.href).toContain(`recipes/${recipe.id}`);
  });
});
