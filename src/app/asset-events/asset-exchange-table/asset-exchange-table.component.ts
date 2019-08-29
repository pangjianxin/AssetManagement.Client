import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime } from 'rxjs/operators';
import { AssetExchangingEvent } from 'src/app/models/asset-exchanging-event';
import { AssetExchangingService } from 'src/app/core/services/asset-exchanging-service';


@Component({
  selector: 'app-asset-exchange-table',
  templateUrl: './asset-exchange-table.component.html',
  styleUrls: ['./asset-exchange-table.component.scss']
})
export class AssetExchangeTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  // 当前分页的基础url
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Output() selected = new EventEmitter<SelectionModel<AssetExchangingEvent>>();
  // 表格数据源
  tableDataSource: MatTableDataSource<AssetExchangingEvent> = new MatTableDataSource<AssetExchangingEvent>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'status',
    'requestOrgIdentifier', 'requestOrgNam', 'org2', 'targetOrgIdentifier',
    'targetOrgNam', 'exchangeOrgIdentifier', 'exchangeOrgNam', 'assetName', 'message'];
  // 当前选择的记录行
  selection: SelectionModel<AssetExchangingEvent> = new SelectionModel<AssetExchangingEvent>(true, []);
  constructor(private assetExchangeService: AssetExchangingService) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.initPage();
    this.assetExchangeService.dataSourceChangedSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
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
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableDataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  getPagination() {
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
      targetUrl = `${targetUrl}&filters=AssetExchangingFilter==${this.currentFileterData}`;
    }
    this.assetExchangeService.getPagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.tableDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }

}
