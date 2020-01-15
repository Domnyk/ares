import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../model/recipe';
import {of, Subject, throwError} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {UserService} from '../service/user.service';
import {AuthService} from '../service/auth.service';
import {User} from '../model/user';
import {CurrentUser} from '../model/current-user';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, OnDestroy {

  public myRecipes: Recipe[] = [];
  public myFavouriteRecipes: Recipe[] = [];
  public recommendedRecipes: Recipe[] = [];
  public myRecipesPage = 1;
  public favouriteRecipesPage = 1;
  public recommendedRecipesPage = 1;
  public pageSize = 4;
  public pageLoaded = false;
  private unsubscribe = new Subject<void>();

  constructor(private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.authService.currentUser.pipe(
      take(1),
      switchMap((currentUser: CurrentUser | null) => !!currentUser ? this.userService.fetchUserInfo(currentUser.id) : of(null)),
    ).subscribe((userInfo: User | null) => {
      if (!!userInfo) {
        this.myRecipes = !!userInfo.my_recipes ? userInfo.my_recipes : [];
        this.myFavouriteRecipes = !!userInfo.favourite_recipes ? userInfo.favourite_recipes : [];
        this.recommendedRecipes = !!userInfo.recommended_recipes ? userInfo.recommended_recipes : [];
        this.pageLoaded = true;
      } else {
        console.warn('Fetching user by id failed');
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
