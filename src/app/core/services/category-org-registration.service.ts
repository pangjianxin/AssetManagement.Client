import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/models/dtos/organization';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryOrgRegistrationService {
  baseUrl = environment.apiBaseUrls.categoryOrgRegistration;
  constructor(private http: HttpClient) { }
  /*根据资产分类索引和二级行号查找符合条件的机构*/
  getExaminationOrgs(cateogryId: string): Observable<RequestActionModel> {
    console.log(this.baseUrl);
    return this.http.get<RequestActionModel>(`${this.baseUrl}/examinations?categoryId=${cateogryId}`);
  }
}
