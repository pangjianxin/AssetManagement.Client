import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { NonauditEvent } from 'src/app/models/nonaudit-event';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { RemoveNonAuditEventViewmodel } from 'src/app/models/viewmodels/remove-non-audit-event-viewmodel';
import { NonauditEventService } from 'src/app/core/services/nonaudit-event.service';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { NonauditeventTableComponent } from '../nonauditevent-table/nonauditevent-table.component';

@Component({
  selector: 'app-nonauditevents',
  templateUrl: './nonauditevents.component.html',
  styleUrls: ['./nonauditevents.component.scss']
})
export class NonauditeventsComponent implements OnInit {
  ngOnInit() {
  }
  constructor() { }
}
