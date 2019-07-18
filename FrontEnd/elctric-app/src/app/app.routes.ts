import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { AppComponent } from './app.component';


const appRoutes: Routes = [

    { path: 'login', component: LoginComponent  },
    { path: 'register', component: RegisterComponent  },

];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
