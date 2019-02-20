import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReturnAssetViewmodel } from 'src/app/models/viewmodels/return-asset-viewmodel';
import { HandleAssetReturningViewmodel } from 'src/app/models/viewmodels/handle-asset-returning-viewmodel';
import { RevokeAssetEventViewmodel } from 'src/app/models/viewmodels/revoke-asset-event-viewmodel';

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
  revoke(model: RevokeAssetEventViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>(`/api/assetReturn/revoke`, JSON.stringify(model));
  }
  returnAsset(model: ReturnAssetViewmodel): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/assetReturn/return', JSON.stringify(model));
  }
  handleAssetReturning(model: HandleAssetReturningViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetReturn/secondary/handle', JSON.stringify(model));
  }
}
