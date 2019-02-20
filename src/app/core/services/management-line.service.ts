import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/models/organization';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagementLineService {

  constructor(private http: HttpClient) { }
  getTargetExaminations(managementLineId: string): Observable<Organization[]> {
    return this.http.get<RequestActionModel>(`/api/managementline/user/examinations?managementLineId=${managementLineId}`)
      .pipe(map(value => value.data));
  }
}
