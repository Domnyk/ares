import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-components-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  @Input() id: string = 'password';
  @Input() formControlName: string = 'password';

  constructor() { }

  ngOnInit() {
  }

}
