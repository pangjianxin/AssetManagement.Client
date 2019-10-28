import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AssetDeployService extends ServiceBaseService {
  downloadUrl: string;
  public dataSourceChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
    this.downloadUrl = environment.apiBaseUrls.api.assetDeploy_download;
  }
  async downloadAssetDeployFile(startDate: string, endDate: string, exportOrgId: string, importOrgId: string): Promise<Blob> {
    return await this.http.get<Blob>(`${this.downloadUrl}?startDate=
      ${startDate}&endDate=${endDate}&exportOrgId=${exportOrgId}&importOrgId=${importOrgId}`,
      { responseType: 'blob' as 'json' }).toPromise();
  }
}
