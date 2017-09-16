import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { MdInputModule, MdFormFieldModule, MdButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdFormFieldModule,
    MdInputModule,
    MdButtonModule
  ],
  declarations: [
    AppComponent,
    AuthFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
