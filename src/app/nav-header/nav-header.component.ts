import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject<void>();
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
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

  logout(): void {
    this.authService.logout().pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(_ => this.router.navigate(['/login']));
  }
}
