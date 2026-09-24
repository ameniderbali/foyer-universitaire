import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Chambre } from './features/chambre/chambre';
import { Bloc } from './features/bloc/bloc';
import { Foyer } from './features/foyer/foyer.component';
import { Layout } from './core/layout/layout';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full", },
  { path: "login", component: Login, },
  { path: "", component: Layout, children: 
	[
    { path: "chambre", component: Chambre, /*canActivate: [authGuard],*/ },
	{ path: "bloc", component: Bloc, /*canActivate: [authGuard],*/ },
  { path: "foyer", component: Foyer }, 
    ],
  },
];
