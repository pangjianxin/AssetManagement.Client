import { Component, OnInit, OnChanges, ViewChild, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssetCategory } from 'src/app/models/asset-category';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategoryService } from 'src/app/core/services/asset-category.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-asset-category-table',
  templateUrl: './asset-category-table.component.html',
  styleUrls: ['./asset-category-table.component.scss']
})
export class AssetCategoryTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Output() selected = new EventEmitter<SelectionModel<AssetCategory>>();
  assetCategoryDataSource: MatTableDataSource<AssetCategory> = new MatTableDataSource<AssetCategory>();
  // 总数
  totalAssetCategoriesCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'assetThirdLevelCategory', 'assetSecondLevelCategory', 'assetFirstLevelCategory', 'assetMeteringUnit'];
  // 当前选择的记录行
  selection: SelectionModel<AssetCategory> = new SelectionModel<AssetCategory>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private assetCategoryService: AssetCategoryService) {
  }
  ngOnInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetCategoryPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(value => {
      this.selected.emit(this.selection);
    });
    this.initTableParameters();
    this.getAssetCategoryPagination();
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
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.assetCategoryDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.assetCategoryDataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  getAssetCategoryPagination() {
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
      targetUrl = `${targetUrl}&filters=AssetCategoryFilter==${this.currentFileterData}`;
    }
    this.assetCategoryService.getPagination(targetUrl).subscribe(response => {
      this.totalAssetCategoriesCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetCategoryDataSource.data = response.body.data;
    });
    this.selection.clear();
  }
  onDataSourceChanged() {
    this.getAssetCategoryPagination();
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
}
