import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApply } from 'src/app/models/dtos/asset-apply';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { MatDialog } from '@angular/material';
import { AssetService } from 'src/app/core/services/asset.service';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, filter } from 'rxjs/operators';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { HandleAssetApplyDialogComponent } from './handle-asset-apply-dialog/handle-asset-apply-dialog.component';
import { environment } from '../../../../environments/environment';
import { RevokeApplyDialogComponent } from './revoke-apply-dialog/revoke-apply-dialog.component';

@Component({
  selector: 'app-asset-apply',
  templateUrl: './asset-apply.component.html',
  styleUrls: ['./asset-apply.component.scss']
})
export class AssetApplyComponent implements OnInit {

  assetApplyUrl: string;
  searchInputContent: string;
  selection: SelectionModel<AssetApply> = new SelectionModel<AssetApply>(true, []);
  currentSelectionRow: AssetApply;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  constructor(private alert: AlertService,
    private dialog: MatDialog) {
    this.assetApplyUrl = environment.apiBaseUrls.odata.assetApply_manage;
  }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), pluck('target', 'value'))
      .subscribe((value: string) => this.searchInputContent = this.manipulateOdataFilter(value));
  }
  onSelected($evnet: SelectionModel<AssetApply>) {
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
          this.dialog.open(RevokeApplyDialogComponent, { data: { assetApply: this.currentSelectionRow } });
          break;
      }
    }
  }
  openHandleAssetApplyingDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一个进行操作');
    } else {
      this.currentSelectionRow = this.selection.selected[0];
      switch (this.currentSelectionRow.status) {
        case '待处理':
          this.dialog.open(HandleAssetApplyDialogComponent, {
            data:
            {
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
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(requestOrgIdentifier,'${input}') or contains(requestOrgNam,'${input}')`;
    }
    return '';
  }
}
