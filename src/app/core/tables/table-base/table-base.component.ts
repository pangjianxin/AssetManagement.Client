import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-table-base',
  templateUrl: './table-base.component.html',
})
export class TableBaseComponent<TEntity>  {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  // 当前分页的基础url
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Output() selected = new EventEmitter<SelectionModel<TEntity>>();
  @Input() currentFileterData: string;
  // 表格数据源
  tableDataSource: MatTableDataSource<TEntity> = new MatTableDataSource<TEntity>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 当前选择的记录行
  selection: SelectionModel<TEntity> = new SelectionModel<TEntity>(true, []);
  constructor() {

  }
  // 初始化表格
  protected initTableParameters() {
    this.currentPage = {
      pageIndex: 1,
      pageSize: 10,
      length: 0
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
  }
  /** 判断是否已经选择了所有行 */
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableDataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  public changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  protected applySort(targetUrl: string): string {
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
    return targetUrl;
  }
  protected applyFilter(targetUrl: string): string {
    if (this.currentFileterData) {
      targetUrl = `${targetUrl}&filters=AssetApplyingEventsFilter==${this.currentFileterData}`;
    }
    return targetUrl;
  }
  protected initPage() {
    this.paginator.page.emit({ pageIndex: 1, pageSize: 10, length: 0 });
  }
}
