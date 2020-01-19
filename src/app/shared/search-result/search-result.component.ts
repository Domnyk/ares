import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../../model/recipe';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input() public recipe!: Recipe;
  private currentUser: number | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser
      .subscribe((user) => {
        if (user !== null) {
        this.currentUser = user.id;
        }
      });
  }

  isCreatedByUser(): boolean {
    return this.recipe.user === this.currentUser;
  }
}
