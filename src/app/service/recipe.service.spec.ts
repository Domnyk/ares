import {TestBed} from '@angular/core/testing';

import {RecipeService} from './recipe.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('RecipeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [HttpClient]
  }));

  it('should be created', () => {
    const service: RecipeService = TestBed.get(RecipeService);
    expect(service).toBeTruthy();
  });
});
