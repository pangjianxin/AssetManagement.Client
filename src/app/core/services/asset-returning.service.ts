import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReturnAsset } from 'src/app/models/viewmodels/return-asset';
import { HandleAssetReturn } from 'src/app/models/viewmodels/handle-asset-return';
import { RevokeAsset } from 'src/app/models/viewmodels/revoke-asset-event';

@Injectable({
  providedIn: 'root'
})
export class AssetReturningService {
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  getFirstFiveBySecondaryAdminAsync(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetReturn/secondary/firstFive');
  }
  getFirstFiveByUserAsync(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetReturn/current/firstFive');
  }
  getPagination(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  remove(eventId: string): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/assetReturn/remove?eventId=${eventId}`);
  }
  revoke(model: RevokeAsset): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>(`/api/assetReturn/revoke`, JSON.stringify(model));
  }
  returnAsset(model: ReturnAsset): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/assetReturn/return', JSON.stringify(model));
  }
  handleAssetReturning(model: HandleAssetReturn): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetReturn/secondary/handle', JSON.stringify(model));
  }
}
