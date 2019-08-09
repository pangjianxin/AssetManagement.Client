import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AddMaintainer } from 'src/app/models/viewmodels/add-maintainer';
import { Observable, Subject } from 'rxjs';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { DeleteMaintainer } from 'src/app/models/viewmodels/delete-maintainer';
import { ApplyMaintain } from 'src/app/models/viewmodels/apply-maintain';

@Injectable({
  providedIn: 'root'
})
export class MaintainerService {
  dataSourceChangeSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  /**添加服务商 */
  addMaintainer(model: AddMaintainer): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/maintainer/secondary/create', JSON.stringify(model));
  }
  /**服务商表分页数据 */
  paginationAsync(url: string): Observable<HttpResponse<RequestActionModel>> {
    console.log(url);
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  /**删除服务商 */
  deleteMaintainer(model: DeleteMaintainer): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/maintainer/secondary/delete?maintainerId=${model.maintainerId}`);
  }
  /**根据资产分类查找服务商 */
  getMaintainersByCategoryid(assetCategoryId: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/maintainer/current/maintainers?assetCategoryId=${assetCategoryId}`);
  }
  /**根据资产分类查找是否存在服务商 */
  anyMaintainer(assetCategoryId: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/maintainer/current/anymaintainer?assetCategoryId=${assetCategoryId}`);
  }
}
