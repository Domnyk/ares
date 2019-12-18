import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { SearchBoxComponent } from './main-page/search-box/search-box.component';
import { SearchResultComponent } from './main-page/search-result/search-result.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { SearchTabComponent } from './search-tab/search-tab.component';
import {SearchResolver} from './search-tab/resolver/search-resolver';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import {RegistrationFormComponent} from './registration-form/registration-form.component';

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
    RegistrationFormComponent
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
  ],
  providers: [SearchResolver, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
