import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Maintainer } from 'src/app/models/dtos/maintainer';
import { MaintainerService } from '../../services/maintainer.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-maintainer-table',
  templateUrl: './maintainer-table.component.html',
  styleUrls: ['./maintainer-table.component.scss']
})
export class MaintainerTableComponent implements OnInit, OnChanges {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Output() selected = new EventEmitter<SelectionModel<Maintainer>>();
  dataSource: MatTableDataSource<Maintainer> = new MatTableDataSource<Maintainer>();
  // 总数
  totalCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'companyName', 'maintainerName', 'telephone', 'officePhone',
    'org2', 'categoryFirstLevel', 'categorySecondLevel', 'categoryThirdLevel'];
  // 当前选择的记录行
  selection: SelectionModel<Maintainer> = new SelectionModel<Maintainer>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private maintainerService: MaintainerService) {
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
    this.maintainerService.dataSourceChangeSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.initPage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentFileterData'] && !changes['currentFileterData'].firstChange) {
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
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  private getAssetPagination() {
    // 基础URL
    let targetUrl = `${this.apiUrl}?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    // 排序功能
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
    // 过滤功能
    if (this.currentFileterData) {
      targetUrl = `${targetUrl}&filters=StockTakingOrgFilter==${this.currentFileterData}`;
    }
    // 最终的URL执行分页功能
    this.maintainerService.paginationAsync(targetUrl).subscribe(response => {
      this.totalCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.dataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }

}
