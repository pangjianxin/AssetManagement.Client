import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { ExchangeAsset } from 'src/app/models/viewmodels/exchange-asset';
import { HandleAssetExchange } from 'src/app/models/viewmodels/handle-asset-exchange';
import { environment } from 'src/environments/environment';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AssetExchangingService extends ServiceBaseService {
  post_apiUrl: string;
  put_handle_apiUrl: string;
  put_revoke_apiUrl: string;
  delete_apiUrl: string;
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.post_apiUrl = environment.apiBaseUrls.api.assetExchange_post;
    this.put_handle_apiUrl = environment.apiBaseUrls.api.assetExchange_put_handle;
    this.put_revoke_apiUrl = environment.apiBaseUrls.api.assetExchange_put_revoke;
    this.delete_apiUrl = environment.apiBaseUrls.api.assetExchange_delete;

  }
  revoke(eventId: string, message: string): Observable<ActionResult> {
    return this.http.put<ActionResult>(this.put_revoke_apiUrl, JSON.stringify({
      eventId: eventId,
      message: message
    }));
  }
  remove(eventId: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${this.delete_apiUrl}?eventId=${eventId}`);
  }
  exchangeAsset(model: ExchangeAsset): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.post_apiUrl, JSON.stringify(model));
  }
  handleAssetExchanging(model: HandleAssetExchange): Observable<ActionResult> {
    return this.http.put<ActionResult>(this.put_handle_apiUrl, JSON.stringify(model));
  }
}
