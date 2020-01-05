import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ElementType} from '../../../model/element-type.enum';

@Component({
  selector: 'app-element-box',
  templateUrl: './element-box.component.html',
  styleUrls: ['./element-box.component.scss']
})


export class ElementBoxComponent implements OnInit {

  @Input() name: string = '';
  @Input() elementType!: ElementType;
  @Output() removeIngredient = new EventEmitter<string>();
  @Output() removeCategory = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  remove(): void {
    switch (this.elementType) {
      case ElementType.INGREDIENT:
        this.removeIngredient.emit(this.name);
        break;
      case ElementType.CATEGORY:
        this.removeCategory.emit(this.name);
    }
  }
}
