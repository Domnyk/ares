import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FiltersComponent} from './filters.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ElementBoxComponent} from './element-box/element-box.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Observable, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';


const authDelay = 2000;
const authService = {
  login(u, p): Observable<boolean> {
    return timer(authDelay).pipe(
      map(_ => true)
    );
  }
};

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersComponent, ElementBoxComponent],
      imports: [[TranslateModule.forRoot(), NgbModule, ReactiveFormsModule, RouterTestingModule]],
      providers: [HttpClient, HttpHandler]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
;
