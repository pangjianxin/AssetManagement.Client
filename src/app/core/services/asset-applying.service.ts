import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { AssetApplyingViewmodel } from 'src/app/models/viewmodels/asset-applying-viewmodel';
import { HandleAssetApplyingViewmodel } from 'src/app/models/viewmodels/handle-asset-applying-viewmodel';

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
    return this.http.delete<RequestActionModel>(`/api/assetApply/secondary/revoke?eventId=${eventId}&message=${message}`);
  }
  applyAsset(viewModel: AssetApplyingViewmodel) {
    return this.http.post<RequestActionModel>(`/api/assetApply/apply`, JSON.stringify(viewModel));
  }
  handleAsync(model: HandleAssetApplyingViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetApply/secondary/handle', JSON.stringify(model));
  }
}
