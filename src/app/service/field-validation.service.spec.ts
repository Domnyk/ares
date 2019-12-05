import { TestBed } from '@angular/core/testing';

import { FieldValidationService } from './field-validation.service';

describe('FieldValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FieldValidationService = TestBed.get(FieldValidationService);
    expect(service).toBeTruthy();
  });
});
