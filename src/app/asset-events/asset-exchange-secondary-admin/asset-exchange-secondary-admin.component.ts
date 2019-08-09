import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetExchangingEvent } from 'src/app/models/asset-exchanging-event';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetExchangingService } from 'src/app/core/services/asset-exchanging-service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetService } from 'src/app/core/services/asset.service';
import { HandleAssetExchange } from 'src/app/models/viewmodels/handle-asset-exchange';

@Component({
  selector: 'app-asset-exchange-secondary-admin',
  templateUrl: './asset-exchange-secondary-admin.component.html',
  styleUrls: ['./asset-exchange-secondary-admin.component.scss']
})
export class AssetExchangeSecondaryAdminComponent implements OnInit {
  assetExchangingSecondaryAdminUrl = '/api/assetExchange/secondary/pagination/';
  currentSearchInput: string;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('revokeEventRef') revokeEventRef: TemplateRef<any>;
  @ViewChild('removeEventRef') removeEventRef: TemplateRef<any>;
  @ViewChild('handleEventRef') handleEventRef: TemplateRef<any>;
  currentSelection: SelectionModel<AssetExchangingEvent> = new SelectionModel<AssetExchangingEvent>(true, []);
  currentSelectedRow: AssetExchangingEvent;
  revokeEventForm: FormGroup;
  currentRevokeSubmited = false;
  currentRemoveSubmited = false;
  currentHandleSubmited = false;
  requestObserver = {
    next: (value: RequestActionModel) => {
      this.alert.success(value.message);
      this.assetExchangeService.dataSourceChangedSubject.next(true);
    },
    error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
  };
  constructor(private alert: AlertService,
    private assetExchangeService: AssetExchangingService,
    private assetService: AssetService,
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.currentSearchInput = value);
  }
  onSelected($event: SelectionModel<AssetExchangingEvent>) {
    this.currentSelection = $event;
  }
  get isOneSelected() {
    return this.currentSelection.selected.length === 1;
  }
  openRevokeEventDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一个进行操作');
    } else {
      this.currentSelectedRow = this.currentSelection.selected[0];
      switch (this.currentSelectedRow.status) {
        case '已撤销':
          this.alert.warn('该事件已处于撤销状态');
          break;
        case '已完成':
          this.alert.warn('该事件已处于完成状态，不可撤销');
          break;
        default:
          this.revokeEventForm = this.fb.group({
            message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
          });
          const revokeEventDialog = this.dialog.open(this.revokeEventRef);
          revokeEventDialog.afterClosed().subscribe(value => {
            this.currentRevokeSubmited = false;
          });
          break;
      }
    }
  }
  openHandleEventDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一个进行操作');
    } else {
      this.currentSelectedRow = this.currentSelection.selected[0];
      switch (this.currentSelectedRow.status) {
        case '已撤销':
        case '已完成':
          const removeEventDialog = this.dialog.open(this.removeEventRef);
          removeEventDialog.afterClosed().subscribe(value => this.currentRemoveSubmited = false);
          break;
        default:
          const handleEventDialog = this.dialog.open(this.handleEventRef);
          handleEventDialog.afterClosed().subscribe(value => {
            this.currentHandleSubmited = false;
          });
          break;
      }
    }
  }
  revokeEvent() {
    this.currentRevokeSubmited = true;
    const message = this.revokeEventForm.get('message').value;
    this.assetExchangeService.revoke(this.currentSelectedRow.eventId, message).subscribe(this.requestObserver);
  }
  removeEvent() {
    this.currentRemoveSubmited = true;
    const eventId = this.currentSelectedRow.eventId;
    this.assetExchangeService.remove(eventId).subscribe(this.requestObserver);
  }
  handleEvent() {
    const model: HandleAssetExchange = {
      eventId: this.currentSelectedRow.eventId
    };
    this.assetExchangeService.handleAssetExchanging(model).subscribe(this.requestObserver);
  }
}
