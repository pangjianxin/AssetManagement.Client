import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetReturningEvent } from 'src/app/models/asset-returning-event';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssetReturningService } from 'src/app/core/services/asset-returning.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HandleAssetReturn } from 'src/app/models/viewmodels/handle-asset-return';
import { HttpErrorResponse } from '@angular/common/http';
import { RevokeAsset } from 'src/app/models/viewmodels/revoke-asset-event';

@Component({
  selector: 'app-asset-returning-secondary-admin',
  templateUrl: './asset-returning-secondary-admin.component.html',
  styleUrls: ['./asset-returning-secondary-admin.component.scss']
})
export class AssetReturningSecondaryAdminComponent implements OnInit {
  secondaryAdminApiUrl = '/api/assetReturn/secondary/pagination';
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('revokeEventRef', { static: true }) revokeEventRef: TemplateRef<any>;
  @ViewChild('removeEventRef', { static: true }) removeEventRef: TemplateRef<any>;
  @ViewChild('handleEventRef', { static: true }) handleEventRef: TemplateRef<any>;
  currentSearchInput: string;
  selection: SelectionModel<AssetReturningEvent> = new SelectionModel<AssetReturningEvent>(true, []);
  currentSelectedRow: AssetReturningEvent;
  revokeEventForm: FormGroup;

  constructor(private fb: FormBuilder,
    private assetReturnService: AssetReturningService,
    private alert: AlertService,
    private dialog: MatDialog) { }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.currentSearchInput = value;
      });
  }
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<AssetReturningEvent>) {
    this.selection = $event;
  }
  openRevokeApplicationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一个进行操作');
    } else if (this.selection.selected[0].status !== '待处理') {
      this.alert.warn('事件状态不为待处理，不可撤销');
    } else {
      this.revokeEventForm = this.fb.group({
        message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]]
      });
      this.currentSelectedRow = this.selection.selected[0];
      this.dialog.open(this.revokeEventRef);
    }

  }
  revokeApplication() {
    const eventId = this.currentSelectedRow.eventId;
    const message = this.revokeEventForm.get('message').value;
    const model: RevokeAsset = { eventId, message };
    this.assetReturnService.revoke(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetReturnService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
  openHandleApplicationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一个进行操作');
    } else {
      this.currentSelectedRow = this.selection.selected[0];
      if (this.currentSelectedRow.status !== '待处理') {
        this.alert.warn('该条申请的状态不为待处理，请核对后提交');
        return;
      }
      this.dialog.open(this.handleEventRef);
    }
  }
  handleApplication() {
    const model: HandleAssetReturn = {
      eventId: this.currentSelectedRow.eventId
    };
    this.assetReturnService.handleAssetReturning(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetReturnService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
}



