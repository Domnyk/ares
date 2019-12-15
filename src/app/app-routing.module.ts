import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {SearchTabComponent} from './search-tab/search-tab.component';
import {SearchResolver} from './search-tab/resolver/search-resolver';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthGuard } from './route-guards/auth.guard';
import {RegistrationFormComponent} from "./registration-form/registration-form.component";

const routes: Routes = [
  { path: '', canActivateChild: [AuthGuard], children: [
    { path: '', component: MainPageComponent },
    { path: 'profile', component: MyProfileComponent },
    { path: 'search', component: SearchTabComponent, resolve: { foundRecipes: SearchResolver } },
  ]},
  { path: 'login', component: LoginFormComponent },
  { path: 'registration', component: RegistrationFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
