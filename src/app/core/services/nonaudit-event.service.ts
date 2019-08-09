import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { RemoveNonAuditEvent } from 'src/app/models/viewmodels/remove-non-audit-event';

@Injectable({
  providedIn: 'root'
})
export class NonauditEventService {

  constructor(private http: HttpClient) { }
  getPaginationByCurrent(): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>('/api/nonauditevents/current/pagination', { observe: 'response' });
  }

  getPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  getPaginationBySecondaryAdmin(): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>('/api/nonauditevents/secondaryadmin/pagination', { observe: 'response' });
  }
  removeNonAuditEvent(removeNonAuditEventModel: RemoveNonAuditEvent): Observable<RequestActionModel> {
    return this.http.delete<RequestActionModel>(`/api/nonauditevents/delete?eventId=${removeNonAuditEventModel.eventId}`);
  }
}
