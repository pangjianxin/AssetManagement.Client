import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { AssetExchangeViewmodel } from 'src/app/models/viewmodels/asset-exchange-viewmodel';
import { HandleAssetExchangeViewmodel } from 'src/app/models/viewmodels/handle-asset-exchange-viewmodel';

@Injectable({
  providedIn: 'root'
})
export class AssetExchangingService {
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  getFirstFiveBySecondaryAdminAsync(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetExchange/secondary/firstfive');
  }
  getFirstFiveByUserAsync(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetExchange/current/firstfive');
  }
  getPagination(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  revoke(eventId: string, message: string): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/assetExchange/revoke?eventId=${eventId}&message=${message}`);
  }
  remove(eventId: string): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/assetExchange/remove?eventId=${eventId}`);
  }
  exchangeAsset(model: AssetExchangeViewmodel): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/assetExchange/exchange', JSON.stringify(model));
  }
  handleAssetExchanging(model: HandleAssetExchangeViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetExchange/secondary/handle', JSON.stringify(model));
  }
}
