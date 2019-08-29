import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/core/services/alert.service';
import { Asset } from 'src/app/models/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { SelectionModel } from '@angular/cdk/collections';
import { HandleAssetApply } from 'src/app/models/viewmodels/handle-asset-apply';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';

@Component({
  selector: 'app-handle-asset-applying',
  templateUrl: './handle-asset-applying.component.html',
  styleUrls: ['./handle-asset-applying.component.scss']
})
export class HandleAssetApplyingComponent implements OnInit {
  assetDataSource: MatTableDataSource<Asset> = new MatTableDataSource<Asset>();
  apiUrl = `/api/assets/secondary/pagination/thirdlevel?categoryId=${this.data.assetApplyingEvent.assetCategoryId}`;
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
    public dialog: MatDialog) { }
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
    this.assetService.getAssetsPagination(targetUrl).subscribe(response => {
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
      assetId: this.currentSelectionRow.assetId,
      eventId: this.data.assetApplyingEvent.eventId
    };
    this.assetApplyService.handleAsync(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
}
