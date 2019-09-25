import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }
  getOrgsBySearchInput(searchInput: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/auth/accounts/search?searchInput=${searchInput}`);
  }
  getOrgsByOrg2(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/auth/accounts/org2`);
  }
}
