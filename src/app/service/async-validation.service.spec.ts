import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AsyncValidationService } from './async-validation.service';


describe('AsyncValidationService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: AsyncValidationService = TestBed.get(AsyncValidationService);
    expect(service).toBeTruthy();
  });
});
