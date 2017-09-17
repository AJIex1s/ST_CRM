import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './sign-in/index';
import { AuthGuard } from './guards/index';
import { HomeComponent } from './home/index'

const appRoutes: Routes = [
    { path: 'sign-in', component: SignInComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);