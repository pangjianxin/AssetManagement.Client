import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CreateAssetInventoryDetail } from 'src/app/models/viewmodels/create-asset-inventory-detail';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { ServiceBaseService } from './service-base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvnetoryDetailService extends ServiceBaseService {
  invnetoryDetail_post: string;
  public dataSourceChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.invnetoryDetail_post = environment.apiBaseUrls.api.inventoryDetail_post;
  }
  createInventoryDetail(model: CreateAssetInventoryDetail): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.invnetoryDetail_post, JSON.stringify(model));
  }
}
