import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IStudent } from './student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'app-student',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'name', 'adhaar', 'school', 'actions'];
  dataSource: IStudent[] = [];
  isFormVisible = false;
  isEditMode = false;
  currentStudentId: number | null = null;
  studentForm!: FormGroup;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.initForm();
  }

  loadStudents(): void {
    this.studentService.get().subscribe((data) => {
      this.dataSource = data;
    });
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      Id: [null],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      adhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      school: ['', Validators.required],
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
    this.isEditMode = false;
    this.studentForm.reset();
  }

  editStudent(student: IStudent): void {
    this.isFormVisible = true;
    this.isEditMode = true;
    this.currentStudentId = student.Id ?? null;
    this.studentForm.patchValue(student);
  }

  deleteStudent(studentId: number): void {
    this.studentService.delete(studentId).subscribe(() => {
      this.loadStudents();
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const student = this.studentForm.value;
      if (this.isEditMode) {
        this.studentService.edit(student).subscribe(() => {
          this.loadStudents();
          this.toggleForm();
        });
      } else {
        this.studentService.add(student).subscribe(() => {
          this.loadStudents();
          this.toggleForm();
        });
      }
    }
  }

  getErrorMessages(controlName: string): string[] {
    const control = this.studentForm.get(controlName);
    if (control?.touched && control?.invalid) {
      const errors: { [key: string]: string } = {
        required: 'This field is required.',
        minlength: 'Too short.',
        maxlength: 'Too long.',
        pattern: 'Invalid format.',
      };
      return Object.keys(control.errors || {}).map((key) => errors[key]);
    }
    return [];
  }
}
