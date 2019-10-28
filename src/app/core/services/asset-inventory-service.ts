import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CteateAssetInventory } from 'src/app/models/viewmodels/create-asset-inventory';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { Observable, Subject } from 'rxjs';
import { CreateAssetInventoryDetail } from 'src/app/models/viewmodels/create-asset-inventory-detail';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssetInventoryService {
  dataSourceChangedSubject: Subject<boolean> = new Subject<boolean>();
  inventory_post: string;
  invnetoryDetail_post: string;
  constructor(private http: HttpClient) {
    this.inventory_post = environment.apiBaseUrls.api.inventory_post;
    this.invnetoryDetail_post = environment.apiBaseUrls.api.inventoryDetail_post;
  }
  getByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  // 创建任务
  createAssetInventory(model: CteateAssetInventory): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.inventory_post, JSON.stringify(model));
  }
}
