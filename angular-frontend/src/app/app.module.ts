import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';

import { AuthIntercepptor } from './auth/auth-interceptor';
import { ErrorIntercepptor } from './error-interceptor';

import { PostsModule } from './posts/posts.module';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthIntercepptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorIntercepptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
