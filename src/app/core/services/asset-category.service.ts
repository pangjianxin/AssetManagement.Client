import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable } from 'rxjs';
import { ChangeAssetCategoryMeterUnit } from 'src/app/models/viewmodels/change-asset-category-meter-unit';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  constructor(private http: HttpClient) { }
  getPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getMeteringUnits(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetcategory/current/meteringunits');
  }
  changeMeteringUnit(model: ChangeAssetCategoryMeterUnit): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/assetcategory/secondary/changemeteringunit', JSON.stringify(model));
  }
}
