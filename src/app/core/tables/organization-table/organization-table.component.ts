import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Organization } from 'src/app/models/dtos/organization';
import { FormGroup } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-organization-table',
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.scss']
})
export class OrganizationTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() searchInput: string;
  @Input() apiUrl: string;
  @Output() selected = new EventEmitter<SelectionModel<Organization>>();
  // 数据源
  orgDataSource: MatTableDataSource<Organization> = new MatTableDataSource<Organization>();
  // 总数
  totalOrgCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['select', 'orgIdentifier', 'orgShortNam', 'orgNam', 'upOrg', 'org2', 'orgNam2', 'orgLvl', 'roleDescription'];
  // 当前选择的记录行
  selection: SelectionModel<Organization> = new SelectionModel<Organization>(true, []);
  // 修改机构简称的form
  changeOrgShortNameForm: FormGroup;
  constructor(private accountService: AccountService) { }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['searchInput'].firstChange) {
      this.initPage();
    }
  }
  ngOnInit() {
    /**初始化表格参数 */
    this.initTableParameters();
    /**添加分页逻辑 */
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getOrgPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(value => {
      this.selected.emit(this.selection);
    });
    this.accountService.dataSourceChanged.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    /**提取数据 */
    this.getOrgPagination();
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
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
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
  // 获取分页数据
  getOrgPagination() {
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
    if (this.searchInput) {
      targetUrl = `${targetUrl}&filters=OrgFilter==${this.searchInput}`;
    }
    this.accountService.getOrgPagination(targetUrl).subscribe(response => {
      this.totalOrgCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.orgDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.orgDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.orgDataSource.data.forEach(row => this.selection.select(row));
  }

}
