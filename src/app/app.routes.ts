import { Routes } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { StudentComponent } from './student/student.component';

export const routes: Routes = [
  { path: '', component: SchoolComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'student', component: StudentComponent },
  { path: 'student/school/:schoolId', component: StudentComponent },
];
