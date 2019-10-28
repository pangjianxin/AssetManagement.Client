import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { ModifyAssetLocation } from 'src/app/models/viewmodels/modify-asset-location';
import { StoreAsset } from 'src/app/models/viewmodels/store-asset';
import { environment } from 'src/environments/environment';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService extends ServiceBaseService {
  post_url: string;
  put_url: string;
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.post_url = environment.apiBaseUrls.api.asset_post;
    this.put_url = environment.apiBaseUrls.api.asset_put;
  }
  modifyAssetLocation(model: ModifyAssetLocation): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${this.put_url}`, JSON.stringify(model));
  }
  assetStore(model: StoreAsset): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${this.post_url}`, JSON.stringify(model));
  }
}
