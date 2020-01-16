import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MyProfileComponent} from './my-profile.component';
import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from '../service/auth.service';
import {UserService} from '../service/user.service';
import {SearchResultComponent} from '../shared/search-result/search-result.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProfileComponent, SearchResultComponent],
      imports: [TranslateModule.forRoot(), NgbModule, RouterTestingModule, HttpClientModule],
      providers: [AuthService, UserService, HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
