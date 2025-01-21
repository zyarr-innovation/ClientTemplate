import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StudentService } from '../student.service';
import { ActivatedRoute } from '@angular/router';

type ControlNames = 'name' | 'adhaar' | 'school';

@Component({
  selector: 'app-update',
  standalone: true, // Mark as standalone component
  imports: [
    CommonModule, // Import CommonModule here
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  updateForm!: FormGroup;
  isEditMode: boolean = false; // New property to check if it's edit mode or add mode

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  validationMessages: { [key in ControlNames]: { [key: string]: string } } = {
    name: {
      required: 'Name is required.',
      minlength: 'Name must be at least 3 characters long.',
      maxlength: 'Name cannot be more than 255 characters long.',
    },
    adhaar: {
      required: 'Aadhaar is required.',
      pattern: 'Aadhaar should be a 12-digit number.',
    },
    school: {
      required: 'School is required.',
    },
  };

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!studentId;

    this.updateForm = this.fb.group({
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

    if (this.isEditMode) {
      this.studentService.get().subscribe((students) => {
        const student = students.find((s) => s.Id === +studentId!);
        if (student) {
          this.updateForm.patchValue({
            Id: student.Id,
            name: student.name,
            adhaar: student.adhaar,
            school: student.school,
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      if (this.isEditMode) {
        this.studentService.edit(this.updateForm.value).subscribe(() => {
          console.log('Student updated:', this.updateForm.value);
        });
      } else {
        this.studentService.add(this.updateForm.value).subscribe(() => {
          console.log('New student added:', this.updateForm.value);
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  getErrorMessages(controlName: ControlNames): string[] {
    const control = this.updateForm.get(controlName);
    if (control?.touched && control?.invalid) {
      return Object.keys(control.errors || {}).map(
        (errorKey) => this.validationMessages[controlName][errorKey]
      );
    }
    return [];
  }
}
