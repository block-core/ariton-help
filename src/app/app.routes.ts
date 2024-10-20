import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewComponent } from './view/view.component';
import { TagComponent } from './tag/tag.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'r/:id', component: ViewComponent },
  { path: 't/:tag', component: TagComponent }

];