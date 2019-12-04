import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-components-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  @Input() isDisabled: boolean = false;
  @Input() submitText: string = 'Submit';

  constructor() { }

  ngOnInit() {
  }

}
