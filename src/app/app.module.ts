import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  MdInputModule,
          MdFormFieldModule,
          MdButtonModule,
          MdSidenavModule,
          MdListModule,
          MdExpansionModule,
          MdDatepickerModule,
          MdNativeDateModule,
          MdSlideToggleModule,
          MdRadioModule,
          MdCheckboxModule
        } from '@angular/material';

// used to create fake backend
import { fakeBackendProvider } from './helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AuthGuard } from './guards/index';
import { AuthenticationService, UserService } from './services/index';


import { HomeComponent } from './home/index';
import { SignInComponent } from './sign-in/sign-in.component';
import { TextFieldComponent } from './home/components/controls/index';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    routing,
    MdFormFieldModule,
    MdInputModule,
    MdButtonModule,
    MdSidenavModule,
    MdListModule,
    MdExpansionModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdSlideToggleModule,
    MdRadioModule,
    MdCheckboxModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    TextFieldComponent
  ],
  providers: [
    AuthGuard,
    UserService,
    AuthenticationService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
