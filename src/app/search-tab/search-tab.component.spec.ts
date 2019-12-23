import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchTabComponent} from './search-tab.component';
import {TranslateModule} from '@ngx-translate/core';
import {FiltersComponent} from './filters/filters.component';
import {SearchResultComponent} from '../shared/search-result/search-result.component';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ElementBoxComponent} from './filters/element-box/element-box.component';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('SearchTabComponent', () => {
  let component: SearchTabComponent;
  let fixture: ComponentFixture<SearchTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTabComponent, FiltersComponent, SearchResultComponent, ElementBoxComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, RouterTestingModule, NgbModule],
      providers: [HttpClient, HttpHandler]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
