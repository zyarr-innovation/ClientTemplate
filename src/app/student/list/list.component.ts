import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StudentService } from '../student.service';
import { IStudent } from '../student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'name', 'adhaar', 'school', 'actions'];
  dataSource: IStudent[] = [];

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.get().subscribe((data) => {
      this.dataSource = data;
    });
  }

  addStudent(): void {
    this.router.navigate(['/add']); // Navigate to the update form with no id
  }

  editStudent(student: any): void {
    this.router.navigate(['/edit', student.Id]);
  }

  deleteStudent(studentId: number): void {
    this.studentService.delete(studentId).subscribe(() => {
      console.log('Deleted student with ID', studentId);
      this.loadStudents(); // Refresh the list after delete
    });
  }
}
