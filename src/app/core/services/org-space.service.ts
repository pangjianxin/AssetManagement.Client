import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable } from 'rxjs';
import { ModifySpaceViewmodel } from 'src/app/models/viewmodels/modify-space-viewmodel';
import { CreateOrgSpaceViewmodel } from 'src/app/models/viewmodels/create-org-space-viewmodel';

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
  createSpace(model: CreateOrgSpaceViewmodel): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/orgspace/create', JSON.stringify(model));
  }
  modifySpace(model: ModifySpaceViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/orgspace/update', JSON.stringify(model));
  }
}
