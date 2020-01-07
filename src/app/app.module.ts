import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {NavHeaderComponent} from './nav-header/nav-header.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {SearchBoxComponent} from './main-page/search-box/search-box.component';
import {SearchResultComponent} from './shared/search-result/search-result.component';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {SearchTabComponent} from './search-tab/search-tab.component';
import {SearchResolver} from './search-tab/resolver/search-resolver';
import {LoginFormComponent} from './login-form/login-form.component';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {RegistrationFormComponent} from './registration-form/registration-form.component';
import { ShowRecipeComponent } from './show-recipe/show-recipe.component';
import { FetchRecipeResolver } from './show-recipe/resolvers/fetch-recipe.resolver';
import { RecipeRatingComponent } from './recipe-rating/recipe-rating.component';
import {FiltersComponent} from './search-tab/filters/filters.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ElementBoxComponent} from './search-tab/filters/element-box/element-box.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NavHeaderComponent,
    SearchBoxComponent,
    SearchResultComponent,
    MyProfileComponent,
    SearchTabComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    ShowRecipeComponent,
    RecipeRatingComponent,
    RegistrationFormComponent,
    FiltersComponent,
    ElementBoxComponent,
    RegistrationFormComponent,
    ShowRecipeComponent,
    RecipeRatingComponent,
    AddRecipeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [SearchResolver, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, FetchRecipeResolver],
  bootstrap: [AppComponent]
})
export class AppModule {
}
