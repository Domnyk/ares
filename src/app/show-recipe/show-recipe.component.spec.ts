import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { of, EMPTY } from 'rxjs';

import { ShowRecipeComponent } from './show-recipe.component';
import { RecipeRatingComponent } from '../recipe-rating/recipe-rating.component';
import { Recipe } from '../model/recipe';
import { By } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';
import { DebugElement } from '@angular/core';
import { RecipeService } from '../service/recipe.service';
import { Rating } from '../model/rating';
import { CurrentUser } from '../model/current-user';
import { AuthService } from '../service/auth.service';

const mockRecipe: Recipe = {
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

const mockRating: Rating = {
  id: -1,
  user: 'donald',
  score: 4,
  recipe: -1
};

const mockCurrentUser: CurrentUser = {
  id: 1,
  username: 'donald',
  token: 'donalds token'
};

class MockActivatedRoute extends ActivatedRoute {
  constructor() {
      super();
      this.data = of({ recipe: mockRecipe });
  }
}

class MockActivatedRouteWithoutRecipe extends ActivatedRoute {
  constructor() {
      super();
      this.data = EMPTY;
  }
}

describe('ShowRecipeComponent', () => {
  const recipeService = {
    findRecipeById: (id: number) => of(mockRecipe),
    fetchRating: (recipeId: number, username: string) => of(mockRating),
    fetchFavourites: () => of([0, 1, 2, 3]),
  };

  const authService = {
    currentUser: of(mockCurrentUser),
  };

  const route = {
    navigate: of(true),
  };

  const compileShowRecipeComponent = (activatedRoute: any) => {
    TestBed.configureTestingModule({
      declarations: [ ShowRecipeComponent, RecipeRatingComponent ],
      imports: [ TranslateModule.forRoot(), HttpClientTestingModule ],
      providers: [ { provide: ActivatedRoute, useClass: activatedRoute }, { provide: RecipeService, useValue: recipeService },
                   { provide: AuthService, useValue: authService }, {provide : Router, useValue: route}]
    })
    .compileComponents();
  };

  describe('When recipe is being fetched', () => {
    let fixture: ComponentFixture<ShowRecipeComponent>;

    beforeEach(async(() => compileShowRecipeComponent(MockActivatedRouteWithoutRecipe)));
    beforeEach(() => {
      fixture = TestBed.createComponent(ShowRecipeComponent);
      fixture.detectChanges();
    });

    it('should display spinner', () => {
      const spinner = fixture.debugElement.query(By.css('div.spinner-border')).nativeElement;
      expect(spinner).toBeTruthy();
    });
  });

  describe('When recipe is ready', () => {
    let component: ShowRecipeComponent;
    let fixture: ComponentFixture<ShowRecipeComponent>;

    beforeEach(async(() => compileShowRecipeComponent(MockActivatedRoute)));
    beforeEach(() => {
      fixture = TestBed.createComponent(ShowRecipeComponent);
      component = fixture.nativeElement;
      fixture.detectChanges();
    });

    it('should contain image', fakeAsync(() => {
      const img = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(img).toBeTruthy();
    }));

    it('should contain list of ingredients', () => {
      const ingredients = fixture.debugElement.queryAll(By.css('li'));
      ingredients.forEach((ingredient: DebugElement, index: number) => {
        const li = ingredient.nativeElement as HTMLLIElement;
        expect(li.textContent).toEqual(mockRecipe.ingredients[index].name);
      });
    });

    it('should contain description', () => {
      const description = fixture.debugElement.query(By.css('#description')).nativeElement as HTMLDivElement;

      expect(description.textContent).toEqual(mockRecipe.description);
    });

    it('should display 5 starts', () => {
      const stars = fixture.debugElement.queryAll(By.css('span.fa-star'));

      expect(stars.length).toEqual(5);
    });
  });


});
