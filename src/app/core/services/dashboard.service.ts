import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getCurrentAssetCategories(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/dashboard/current/assets/categories`);
  }
  getSecondaryAssetCategories(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/dashboard/secondaryadmin/assets/categories');
  }
  getAssetPagination(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  async downloadAssetDeployFile(startDate: string, endDate: string, exportOrgId: string, importOrgId: string): Promise<Blob> {
    return await this.http.get<Blob>(`/api/dashboard/secondaryadmin/assetdeploy/download?startDate=
      ${startDate}&endDate=${endDate}&exportOrgId=${exportOrgId}&importOrgId=${importOrgId}`,
      { responseType: 'blob' as 'json' }).toPromise();
  }
}
