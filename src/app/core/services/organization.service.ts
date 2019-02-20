import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }
  getOrgsBySeachInput(searchInput: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/auth/current/accounts?searchInput=${searchInput}`);
  }
}
