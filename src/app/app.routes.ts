import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Chambre } from './features/chambre/chambre';
import { Bloc } from './features/bloc/bloc';
import { Foyer } from './features/foyer/foyer.component';
import { EtudiantComponent } from './features/etudiant/etudiant';
import { ReservationComponent } from './features/reservation/reservation';
import { UniversiteComponent } from './features/universite/universite';
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
    { path: "etudiant", component: EtudiantComponent },
    { path: "reservation", component: ReservationComponent },
    { path: "universite", component: UniversiteComponent },
    ],
  },
];
