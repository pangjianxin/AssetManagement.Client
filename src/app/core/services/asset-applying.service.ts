import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApplyAsset } from 'src/app/models/viewmodels/apply-asset';
import { HandleAssetApply } from 'src/app/models/viewmodels/handle-asset-apply';

@Injectable({
  providedIn: 'root'
})
export class AssetApplyingService {
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  getFirstFiveBySecondaryAdminAsync(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetApply/secondary/firstfive');
  }
  getFirstFiveByUserAsync(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetApply/current/firstfive');
  }
  getPagination(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  remove(eventId: string): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/assetApply/remove?eventId=${eventId}`);
  }
  revoke(eventId: string, message: string): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/assetApply/revoke?eventId=${eventId}&message=${message}`);
  }
  applyAsset(viewModel: ApplyAsset) {
    return this.http.post<RequestActionModel>(`/api/assetApply/apply`, JSON.stringify(viewModel));
  }
  handleAsync(model: HandleAssetApply): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetApply/secondary/handle', JSON.stringify(model));
  }
}
