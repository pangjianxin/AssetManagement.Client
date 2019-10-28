import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Employee } from 'src/app/models/dtos/employee';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { AddEmployee } from 'src/app/models/viewmodels/add-employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  dataSourceChanged: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  getBySearchInput(name: string): Observable<any> {
    return this.http.get<any>(`/api/employee/current/employeesbyname?name=${name}`);
  }
  getByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  addEmployee(model: AddEmployee): Observable<ActionResult> {
    return this.http.post<ActionResult>(`/api/employee/current/add`, JSON.stringify(model));
  }
}
