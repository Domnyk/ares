import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {SearchTabComponent} from './search-tab/search-tab.component';
import {SearchResolver} from './search-tab/resolver/search-resolver';


const routes: Routes = [
  {path: 'main', component: MainPageComponent},
  {path: 'profile', component: MyProfileComponent},
  {
    path: 'search', component: SearchTabComponent, resolve: {foundRecipes: SearchResolver}
  }
  ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
