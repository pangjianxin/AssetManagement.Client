import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { Observable } from 'rxjs';
import { ChangeAssetCategoryMeterUnit } from 'src/app/models/viewmodels/change-asset-category-meter-unit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {
  baseUrl = environment.apiBaseUrls.assetCategory;
  constructor(private http: HttpClient) { }
  getPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getMeteringUnits(): Observable<RequestActionModel> {
    console.log(this.baseUrl);
    return this.http.get<RequestActionModel>(`${this.baseUrl}/current/units`);
  }
  changeMeteringUnit(model: ChangeAssetCategoryMeterUnit): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>(`${this.baseUrl}/secondary/changeMeteringUnit`, JSON.stringify(model));
  }
}
