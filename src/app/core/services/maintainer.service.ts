import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AddMaintainer } from 'src/app/models/viewmodels/add-maintainer';
import { Observable, Subject } from 'rxjs';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { DeleteMaintainer } from 'src/app/models/viewmodels/delete-maintainer';
import { ApplyMaintain } from 'src/app/models/viewmodels/apply-maintain';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintainerService {
  apiUrl: string;
  dataSourceChangeSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiBaseUrls.api.maintainer;
  }
  /**添加服务商 */
  addMaintainer(model: AddMaintainer): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.apiUrl, JSON.stringify(model));
  }
  /**服务商表分页数据 */
  getByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  /**删除服务商 */
  deleteMaintainer(model: DeleteMaintainer): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${this.apiUrl}?maintainerId=${model.maintainerId}`);
  }
}
