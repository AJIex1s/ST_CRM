import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MdInputModule,
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

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AuthGuard } from './guards/index';
import { AuthenticationService, UserService } from './services/index';
import { FormControlComponentsFactory } from './home/classes';


import { ToolboxComponent } from './home/toolbox/toolbox.component';
import { LiveEditorComponent } from './home/live-editor/live-editor.component';
import { HomeComponent } from './home/index';
import { SignInComponent } from './sign-in/sign-in.component';
import { TextFieldComponent } from './home/components/controls/index';
import { ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser/src/dom/debug/ng_probe';


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
        ToolboxComponent,
        LiveEditorComponent,
        SignInComponent,
        TextFieldComponent,
    ],
    providers: [
        AuthGuard,
        UserService,
        AuthenticationService,
        FormControlComponentsFactory,

        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    entryComponents: [ TextFieldComponent ],
    bootstrap: [AppComponent]
})
export class AppModule { }
