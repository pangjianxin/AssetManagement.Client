import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChangeAssetCategoryMeterUnit } from 'src/app/models/viewmodels/change-asset-category-meter-unit';
import { environment } from 'src/environments/environment';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService extends ServiceBaseService {
  post_url: string;
  public dataSourceChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.post_url = environment.apiBaseUrls.api.assetCategory_put;
  }
  getByUrl(urlPath: string): Observable<any> {
    return this.http.get<any>(urlPath);
  }
  changeMeteringUnit(model: ChangeAssetCategoryMeterUnit): Observable<ActionResult> {
    return this.http.put<ActionResult>(this.post_url, JSON.stringify(model));
  }
}
