import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NonauditeventTableComponent } from '../nonauditevent-table/nonauditevent-table.component';
import { SelectionModel } from '@angular/cdk/collections';
import { NonauditEvent } from 'src/app/models/nonaudit-event';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { NonauditEventService } from 'src/app/core/services/nonaudit-event.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { RemoveNonAuditEvent } from 'src/app/models/viewmodels/remove-non-audit-event';
import { RequestActionModel } from 'src/app/models/request-action-model';

@Component({
  selector: 'app-nonauditevents-secondary-admin',
  templateUrl: './nonauditevents-secondary-admin.component.html',
  styleUrls: ['./nonauditevents-secondary-admin.component.scss']
})
export class NonauditeventsSecondaryAdminComponent implements OnInit {

  currentNonAuditEventsUrl = '/api/nonauditevents/secondaryadmin/pagination';
  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('removeNonAuditEventRef') removeNonAuditEventRef: TemplateRef<any>;
  @ViewChild('nonauditEventTable') table: NonauditeventTableComponent;
  selection: SelectionModel<NonauditEvent> = new SelectionModel<NonauditEvent>(true, []);
  currentFilterInputValue: string;
  constructor(private dialog: MatDialog,
    private alert: AlertService,
    private nonAuditEventService: NonauditEventService) { }
  get IsOneSelected() {
    return this.selection.selected.length === 1;
  }
  ngOnInit() {
    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.currentFilterInputValue = value);
  }
  onSlected($event: SelectionModel<NonauditEvent>) {
    this.selection = $event;
  }
  openRemoveEventDialog() {
    if (!this.IsOneSelected) {
      this.alert.warn('一次只能选中一个进行操作');
    } else {
      this.dialog.open(this.removeNonAuditEventRef);
    }
  }
  removeEvent() {
    const removeNonAuditEventModel: RemoveNonAuditEvent = { eventId: this.selection.selected[0].id };
    this.nonAuditEventService.removeNonAuditEvent(removeNonAuditEventModel).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(`${value.data.type}删除成功`);
        this.table.onDataSourceChanged();
      },
      error: (value: RequestActionModel) => {
        this.alert.failure(`${value.data.type}删除失败`);
      }
    });
  }

}
