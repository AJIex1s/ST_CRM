import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { MdInput, MdFormField } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    MdInput
  ],
  declarations: [
    AppComponent,
    AuthFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
