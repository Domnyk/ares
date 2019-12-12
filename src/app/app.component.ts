import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './service/auth.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'ares';
  public isLogged: boolean = true;
  private unsubscribe = new Subject<void>();

  constructor(private translate: TranslateService, private authService: AuthService) {
    translate.setDefaultLang('pl');
  }

  ngOnInit(): void {
    this.authService.isLoggedIn.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((isLogged: boolean) => this.isLogged = isLogged);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
