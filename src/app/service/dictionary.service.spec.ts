import { TestBed } from '@angular/core/testing';

import { DictionaryService } from './dictionary.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('DictionaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, HttpHandler]
  }));

  it('should be created', () => {
    const service: DictionaryService = TestBed.get(DictionaryService);
    expect(service).toBeTruthy();
  });
});
