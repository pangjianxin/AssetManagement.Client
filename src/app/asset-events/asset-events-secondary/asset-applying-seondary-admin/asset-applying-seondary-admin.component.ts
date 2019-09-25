import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApplyingEvent } from 'src/app/models/dtos/asset-applying-event';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, filter } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { AssetApplyingTableComponent } from '../../asset-applying-table/asset-applying-table.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { HandleAssetApplyingComponent } from './handle-asset-applying/handle-asset-applying.component';
import { AssetService } from 'src/app/core/services/asset.service';

@Component({
  selector: 'app-asset-applying-seondary-admin',
  templateUrl: './asset-applying-seondary-admin.component.html',
  styleUrls: ['./asset-applying-seondary-admin.component.scss']
})
export class AssetApplyingSeondaryAdminComponent implements OnInit {
  assetApplyingSecondaryAdminUrl: string;
  searchInputContent: string;
  selection: SelectionModel<AssetApplyingEvent> = new SelectionModel<AssetApplyingEvent>(true, []);
  currentSelectionRow: AssetApplyingEvent;
  revokeEventForm: FormGroup;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('table', { static: true }) table: AssetApplyingTableComponent;
  @ViewChild('revokeEventRef', { static: true }) revokeEventRef: TemplateRef<any>;
  constructor(private alert: AlertService,
    private assetApplyingService: AssetApplyingService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private assetService: AssetService) { }

  ngOnInit() {
    this.assetApplyingSecondaryAdminUrl = '/api/assetApply/secondary/pagination';
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), pluck('target', 'value')).subscribe((value: string) => this.searchInputContent = value);
    this.assetService.dataSourceChangedSubject.asObservable().pipe(filter(value => value === true)).subscribe(value => {
      this.assetApplyingService.dataSourceChangedSubject.next(true);
    });
  }
  onSelected($evnet: SelectionModel<AssetApplyingEvent>) {
    this.selection = $evnet;
  }
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  /**打开撤销事件的对话框 */
  openRevokeEventDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一项进行操作');
    } else {
      switch (this.selection.selected[0].status) {
        case '已撤销':
          this.alert.warn('该事件状态已经为已撤销，无需撤销');
          break;
        case '已完成':
          this.alert.warn('该事件状态已经为已完成，无需撤销');
          break;
        default:
          this.currentSelectionRow = this.selection.selected[0];
          this.revokeEventForm = this.fb.group({
            message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]]
          });
          this.dialog.open(this.revokeEventRef);
          break;
      }
    }
  }
  /**撤销事件的逻辑 */
  revokeEvent() {
    const eventId = this.currentSelectionRow.eventId;
    const message = this.revokeEventForm.get('message').value;
    this.assetApplyingService.revoke(eventId, message).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetApplyingService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
  openHandleAssetApplyingDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一个进行操作');
    } else {
      this.currentSelectionRow = this.selection.selected[0];
      switch (this.currentSelectionRow.status) {
        case '待处理':
          this.dialog.open(HandleAssetApplyingComponent, {
            data:
            {
              title: '资产申请处理',
              subTitle: '请核对相应信息，确保准确无误并从符合条件的在库资产清单中挑选一个进行资产分配',
              assetApplyingEvent: this.currentSelectionRow
            }
          });
          break;
        default:
          this.alert.warn('事件状态不为待处理，无法继续处理');
          break;
      }
    }
  }
}
