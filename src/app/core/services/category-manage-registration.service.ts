import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
// 资产分类管理机构注册服务（一个资产分类由一个管理机构来注册进行管理）
export class CategoryManageRegistrationService {
  orgsUrl = environment.apiBaseUrls.odata.assetCategory_orgs;
  constructor(private http: HttpClient) { }
  /*根据资产分类索引和二级行号查找符合条件的机构*/
  getOrgsByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.orgsUrl}?categoryId=${categoryId}`);
  }
}
