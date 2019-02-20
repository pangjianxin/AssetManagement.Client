import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { ModifyAssetLocationViewmodel } from 'src/app/models/viewmodels/modify-asset-location-viewmodel';
import { AssetApplyingViewmodel } from 'src/app/models/viewmodels/asset-applying-viewmodel';
import { ReturnAssetViewmodel } from 'src/app/models/viewmodels/return-asset-viewmodel';
import { HandleAssetApplyingViewmodel } from 'src/app/models/viewmodels/handle-asset-applying-viewmodel';
import { filter } from 'rxjs/operators';
import { HandleAssetReturningViewmodel } from 'src/app/models/viewmodels/handle-asset-returning-viewmodel';
import { AssetExchangeViewmodel } from 'src/app/models/viewmodels/asset-exchange-viewmodel';
import { HandleAssetExchangeViewmodel } from 'src/app/models/viewmodels/handle-asset-exchange-viewmodel';
import { AssetStorageViewmodel } from 'src/app/models/viewmodels/asset-storage-viewmodel';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  getAssetsPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getAssetsCategories(urlPath: string): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(urlPath);
  }
  modifyAsseteLocation(model: ModifyAssetLocationViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assets/current/modifyLocation', JSON.stringify(model));
  }
  assetStore(model: AssetStorageViewmodel): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('', JSON.stringify(model));
  }
}
