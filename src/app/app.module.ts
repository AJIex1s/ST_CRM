import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  MdInputModule,
          MdFormFieldModule,
          MdButtonModule,
          MdSidenavModule
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
import { InputFormFieldComponent } from './home/components/input-form-field/input-form-field.component';

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
    MdSidenavModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    InputFormFieldComponent
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
