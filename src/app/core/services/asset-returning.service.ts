import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReturnAsset } from 'src/app/models/viewmodels/return-asset';
import { HandleAssetReturn } from 'src/app/models/viewmodels/handle-asset-return';
import { RevokeAsset } from 'src/app/models/viewmodels/revoke-asset-event';
import { environment } from 'src/environments/environment';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AssetReturningService extends ServiceBaseService {
  post_url: string;
  delete_url: string;
  put_handle_url: string;
  put_revoke_url: string;
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.post_url = environment.apiBaseUrls.api.assetReturn_post;
    this.delete_url = environment.apiBaseUrls.api.assetReturn_delete;
    this.put_handle_url = environment.apiBaseUrls.api.assetReturn_put_handle;
    this.put_revoke_url = environment.apiBaseUrls.api.assetReturn_put_revoke;
  }
  remove(eventId: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${this.delete_url}?eventId=${eventId}`);
  }
  returnAsset(model: ReturnAsset): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.post_url, JSON.stringify(model));
  }
  revoke(model: RevokeAsset): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${this.put_revoke_url}`, JSON.stringify(model));
  }
  handle(model: HandleAssetReturn): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${this.put_handle_url}`, JSON.stringify(model));
  }
}
