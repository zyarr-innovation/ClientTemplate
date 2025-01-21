import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IStudent } from './student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'data/data.json';
  data: IStudent[] = [];

  constructor(private http: HttpClient) {}

  // Get all students
  get(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(this.apiUrl);
  }

  add(student: IStudent): Observable<IStudent> {
    return this.http.post<IStudent>(`${this.apiUrl}/students`, student);
  }

  edit(student: IStudent): Observable<IStudent> {
    return this.http.put<IStudent>(
      `${this.apiUrl}/students/${student.Id}`,
      student
    );
  }

  delete(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/students/${studentId}`);
  }
}
