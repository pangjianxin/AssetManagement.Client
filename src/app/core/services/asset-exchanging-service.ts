import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { ExchangeAsset } from 'src/app/models/viewmodels/exchange-asset';
import { HandleAssetExchange } from 'src/app/models/viewmodels/handle-asset-exchange';

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
    return this.http.put<RequestActionModel>(`/api/assetExchange/revoke`, JSON.stringify({
      eventId: eventId,
      message: message
    }));
  }
  remove(eventId: string): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/assetExchange/remove?eventId=${eventId}`);
  }
  exchangeAsset(model: ExchangeAsset): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/assetExchange/exchange', JSON.stringify(model));
  }
  handleAssetExchanging(model: HandleAssetExchange): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetExchange/secondary/handle', JSON.stringify(model));
  }
}
