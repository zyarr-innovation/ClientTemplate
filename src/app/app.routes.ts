import { Routes } from '@angular/router';
import { ListComponent } from './student/list/list.component';
import { UpdateComponent } from './student/update/update.component';

export const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'student', component: ListComponent },
  { path: 'edit/:id', component: UpdateComponent },
  { path: 'add', component: UpdateComponent },
];
