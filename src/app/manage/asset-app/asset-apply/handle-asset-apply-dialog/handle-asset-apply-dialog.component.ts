import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { MatTableDataSource, PageEvent, MatPaginator, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Asset } from 'src/app/models/dtos/asset';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetService } from 'src/app/core/services/asset.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { HandleAssetApply } from 'src/app/models/viewmodels/handle-asset-apply';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-handle-asset-apply-dialog',
  templateUrl: './handle-asset-apply-dialog.component.html',
  styleUrls: ['./handle-asset-apply-dialog.component.scss']
})
export class HandleAssetApplyDialogComponent implements OnInit {

  assetDataSource: MatTableDataSource<Asset> = new MatTableDataSource<Asset>();
  apiUrl: string;
  // 总数
  totalAssetsCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  currentSelectionRow: Asset;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('assetApplyingConfirmRef', { static: true }) assetApplyingConfirmRef: TemplateRef<any>;
  // 显示的列
  displayedColumns: string[] = ['select', 'assetName', 'brand', 'assetType', 'assetDescription', 'assetStatus',
    'assetThirdLevelCategory', 'assetInStoreLocation'];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private alert: AlertService,
    private assetService: AssetService,
    private assetApplyService: AssetApplyingService,
    public dialog: MatDialog) {
    console.log(data);
    this.apiUrl = `/api/assets/secondary/pagination/thirdlevel?categoryId=${this.data.assetApplyingEvent.assetCategoryId}`;
  }
  ngOnInit() {
    this.paginator.page.subscribe((value: PageEvent) => {
      this.currentPage = value;
      this.getAssetPagination();
    });
    this.initTableParameters();
    this.initPage();
  }
  private getAssetPagination() {
    const targetUrl = `${this.apiUrl}&page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    this.assetService.getByUrl(targetUrl).subscribe(response => {
      this.totalAssetsCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetDataSource.data = response.body.data;
    });
  }
  // 初始化表格
  private initTableParameters() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 5,
      length: null
    };
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 5, length: null });
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.assetDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.assetDataSource.data.forEach(row => this.selection.select(row));
  }
  isOneSelected() {
    return this.selection.selected.length === 1;
  }
  openAssetApplyingConfirmDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一个进行操作');
    } else {
      this.currentSelectionRow = this.selection.selected[0];
      this.dialog.open(this.assetApplyingConfirmRef);
    }
  }
  handleAssetApplying() {
    const model: HandleAssetApply = {
      assetId: this.currentSelectionRow.id,
      eventId: this.data.assetApplyingEvent.eventId
    };
    this.assetApplyService.handleAsync(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }

}
