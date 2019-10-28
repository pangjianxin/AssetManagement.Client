import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceBaseService {

  constructor(protected http: HttpClient) { }
  getByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
