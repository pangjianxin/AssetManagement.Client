import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, Sort } from '@angular/material';
import { Asset } from 'src/app/models/asset';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetService } from 'src/app/core/services/asset.service';
import { debounceTime, filter } from 'rxjs/operators';
@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.scss']
})
export class AssetTableComponent implements OnInit, OnChanges {
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Output() selected = new EventEmitter<SelectionModel<Asset>>();
  assetDataSource: MatTableDataSource<Asset> = new MatTableDataSource<Asset>();
  // 总数
  totalAssetsCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'assetName', 'brand', 'assetType', 'assetDescription',
    'assetNo', 'assetStatus', 'lastModifyComment', 'orgIdentifier', 'orgNam', 'assetThirdLevelCategory', 'assetInStoreLocation'];
  // 当前选择的记录行
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private assetService: AssetService) {
  }
  ngOnInit() {
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
    this.initTableParameters();
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
      targetUrl = `${targetUrl}&filters=AssetsFilter==${this.currentFileterData}`;
    }
    this.assetService.getAssetsPagination(targetUrl).subscribe(response => {
      this.totalAssetsCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
}
