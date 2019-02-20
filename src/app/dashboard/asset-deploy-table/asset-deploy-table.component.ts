import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Asset } from 'src/app/models/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { debounceTime } from 'rxjs/operators';
import { AssetDeploy } from 'src/app/models/asset-deploy';

@Component({
  selector: 'app-asset-deploy-table',
  templateUrl: './asset-deploy-table.component.html',
  styleUrls: ['./asset-deploy-table.component.scss']
})
export class AssetDeployTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator') paginator: MatPaginator;
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData = '';
  @Output() selected = new EventEmitter<SelectionModel<AssetDeploy>>();
  assetDataSource: MatTableDataSource<AssetDeploy> = new MatTableDataSource<AssetDeploy>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'assetDeployCategory', 'assetName', 'exportOrgIdentifier',
    'exportOrgNam', 'importOrgIdentifier', 'importOrgNam', 'authorizeOrgIdentifier', 'authorizeOrgNam'];
  // 当前选择的记录行
  selection: SelectionModel<AssetDeploy> = new SelectionModel<AssetDeploy>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private assetService: AssetService) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.assetService.dataSourceChangedSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.initPage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['currentFileterData'].firstChange) {
      this.initPage();
    }
  }
  // 初始化表格
  private initTableParameters() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    },
      this.currentSort = {
        active: '',
        direction: ''
      };
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
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  private getAssetPagination() {
    let targetUrl = `${this.apiUrl}?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    if (this.currentSort.direction) {
      switch (this.currentSort.direction) {
        case 'asc': targetUrl = `${targetUrl}&sorts=${this.currentSort.active}`;
          break;
        case 'desc': targetUrl = `${targetUrl}&sorts=-${this.currentSort.active}`;
          break;
        default:
          break;
      }
    }
    if (this.currentFileterData) {
      targetUrl = `${targetUrl}&filters=AssetDeployFilter==${this.currentFileterData}`;
    }
    this.assetService.getAssetsPagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
}
