import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApplyAsset } from 'src/app/models/viewmodels/apply-asset';
import { HandleAssetApply } from 'src/app/models/viewmodels/handle-asset-apply';
import { environment } from 'src/environments/environment';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AssetApplyingService extends ServiceBaseService {
  postUrl: string;
  deleteUrl: string;
  put_handle_url: string;
  put_revoke_url: string;
  public dataSourceChangedSubject = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.postUrl = environment.apiBaseUrls.api.assetApply_post;
    this.deleteUrl = environment.apiBaseUrls.api.asseApply_delete;
    this.put_handle_url = environment.apiBaseUrls.api.assetApply_put_handle;
    this.put_revoke_url = environment.apiBaseUrls.api.assetApply_put_revoke;
  }
  remove(eventId: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${this.deleteUrl}?eventId=${eventId}`);
  }
  revoke(eventId: string, message: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${this.put_revoke_url}?eventId=${eventId}&message=${message}`);
  }
  createApply(viewModel: ApplyAsset): Observable<ActionResult> {
    return this.http.post<ActionResult>(this.postUrl, JSON.stringify(viewModel));
  }
  handleAsync(model: HandleAssetApply): Observable<ActionResult> {
    return this.http.put<ActionResult>(this.put_handle_url, JSON.stringify(model));
  }
}
