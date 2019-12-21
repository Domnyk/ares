import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementBoxComponent } from './element-box.component';

describe('IngredientBoxComponent', () => {
  let component: ElementBoxComponent;
  let fixture: ComponentFixture<ElementBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
