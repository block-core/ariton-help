import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewComponent } from './view/view.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'view/:id', component: ViewComponent }
];