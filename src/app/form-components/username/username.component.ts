import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-components-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {

  @Input() id: string = 'username';

  constructor() { }

  ngOnInit() {
  }

}
