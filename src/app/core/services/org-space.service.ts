import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ModifySpace } from 'src/app/models/viewmodels/modify-space';
import { CreateOrgSpace } from 'src/app/models/viewmodels/create-org-space';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrgSpaceService {
  apiUrl: string;
  public dataSourceChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiBaseUrls.api.orgSpace;
  }
  getByUrl(urlPath: string): Observable<any> {
    return this.http.get<any>(urlPath);
  }
  createSpace(model: CreateOrgSpace): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.apiUrl, JSON.stringify(model));
  }
  modifySpace(model: ModifySpace): Observable<ActionResult> {
    console.log(model);
    return this.http.put<ActionResult>(this.apiUrl, JSON.stringify(model));
  }
}
