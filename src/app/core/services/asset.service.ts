import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { ModifyAssetLocation } from 'src/app/models/viewmodels/modify-asset-location';
import { StoreAsset } from 'src/app/models/viewmodels/store-asset';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  baseUrl = environment.apiBaseUrls.asset;
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  getAssetsPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getAssetsCategories(urlPath: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(urlPath);
  }
  modifyAssetLocation(model: ModifyAssetLocation): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>(`${this.baseUrl}/current/modifyLocation`, JSON.stringify(model));
  }
  assetStore(model: StoreAsset): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>(`${this.baseUrl}/secondary/storage`, JSON.stringify(model));
  }
}
