import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-table-base',
  templateUrl: './table-base.component.html',
})
export class TableBaseComponent<TEntity>  {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() filter: string;
  // 当前分页的基础url
  @Input() url: string;
  // 当前过滤值,由父组件传入的值确定
  @Output() selected = new EventEmitter<SelectionModel<TEntity>>();
  // 表格数据源
  dataSource: MatTableDataSource<TEntity> = new MatTableDataSource<TEntity>();
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
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  public changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  private applySort(targetUrl: string): string {
    if (this.currentSort.direction) {
      switch (this.currentSort.direction) {
        case 'asc': targetUrl = `${targetUrl}&$orderby=${this.currentSort.active}`;
          break;
        case 'desc': targetUrl = `${targetUrl}&$orderby=${this.currentSort.active} desc`;
          break;
        default:
          break;
      }
    }
    return targetUrl;
  }
  private applyFilter(targetUrl: string): string {
    if (this.filter) {
      targetUrl = `${targetUrl}&${this.filter}`;
    }
    return targetUrl;
  }
  protected manipulateFinalUrl(targetUrl: string): string {
    if (targetUrl.indexOf('?') !== -1) {
      targetUrl = `${targetUrl}&$count=true&$top=${this.currentPage.pageSize}&$skip=${this.currentPage.pageIndex * this.currentPage.pageSize}`;
    } else {
      targetUrl = `${targetUrl}?$count=true&$top=${this.currentPage.pageSize}&$skip=${this.currentPage.pageIndex * this.currentPage.pageSize}`;
    }
    targetUrl = this.applyFilter(targetUrl);
    targetUrl = this.applySort(targetUrl);
    return targetUrl;
  }
  protected initPage() {
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
}
