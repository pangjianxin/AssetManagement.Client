import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceBaseService } from './service-base.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends ServiceBaseService {
  public dataSourceChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(http: HttpClient) {
    super(http);
  }
}
