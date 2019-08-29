import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NonauditEvent } from 'src/app/models/nonaudit-event';
import { NonauditEventService } from 'src/app/core/services/nonaudit-event.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-nonauditevent-table',
  templateUrl: './nonauditevent-table.component.html',
  styleUrls: ['./nonauditevent-table.component.scss']
})
export class NonauditeventTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('matSortNonAuditEventTable', { static: true }) matSortNonAuditEvent: MatSort;
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Input() title: string;
  @Input() subTitle: string;
  @Output() selected = new EventEmitter<SelectionModel<NonauditEvent>>();
  nonAuditEventDatasource: MatTableDataSource<NonauditEvent> = new MatTableDataSource<NonauditEvent>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'type', 'orgIdentifier', 'orgNam', 'org2',
    'dateTimeFromNow'];
  // 当前选择的记录行
  selection: SelectionModel<NonauditEvent> = new SelectionModel<NonauditEvent>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private nonAuditEventService: NonauditEventService) {
  }
  ngOnInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getEventsPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(_ => {
      this.selected.emit(this.selection);
    });
    this.initTableParameters();
    this.getEventsPagination();
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
      length: null,
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.nonAuditEventDatasource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.nonAuditEventDatasource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  private getEventsPagination() {
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
      targetUrl = `${targetUrl}&filters=NonAuditEventsFilter==${this.currentFileterData}`;
    }
    this.nonAuditEventService.getPagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.nonAuditEventDatasource.data = response.body.data;
      this.selection.clear();
    });
  }
  /**如果数据源发生变化，那么应该清除当前的选择。应该数据有可能发生了变化 */
  onDataSourceChanged() {
    this.getEventsPagination();
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
}
