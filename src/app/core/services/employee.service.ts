import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Employee } from 'src/app/models/dtos/employee';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { AddEmployee } from 'src/app/models/viewmodels/add-employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  dataSourceChangedBus: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  getEmployeByName(name: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/employee/current/employeesbyname?name=${name}`);
  }
  pagination(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  addEmployee(model: AddEmployee): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>(`/api/employee/current/add`, JSON.stringify(model));
  }
}
