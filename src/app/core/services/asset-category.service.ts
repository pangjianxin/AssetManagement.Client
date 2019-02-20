import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable } from 'rxjs';
import { ChangeAssetCategoryMeterUnitViewmodel } from 'src/app/models/viewmodels/change-asset-category-meter-unit-viewmodel';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  constructor(private http: HttpClient) { }
  getPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getMeteringUnits(): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>('/api/assetcategory/user/meteringunits');
  }
  changeMeteringUnit(model: ChangeAssetCategoryMeterUnitViewmodel) {
    return this.http.put('/api/assetcategory/secondaryadmin/changemeteringunit', JSON.stringify(model));
  }
}
