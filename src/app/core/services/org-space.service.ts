import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { Observable } from 'rxjs';
import { ModifySpace } from 'src/app/models/viewmodels/modify-space';
import { CreateOrgSpace } from 'src/app/models/viewmodels/create-org-space';

@Injectable({
  providedIn: 'root'
})
export class OrgSpaceService {

  constructor(private http: HttpClient) { }
  getSpacePagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getAllSpace(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/orgspace/all');
  }
  createSpace(model: CreateOrgSpace): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/orgspace/create', JSON.stringify(model));
  }
  modifySpace(model: ModifySpace): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/orgspace/update', JSON.stringify(model));
  }
}
