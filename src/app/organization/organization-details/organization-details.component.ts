import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent, MatPaginatorIntl, MatSort, Sort, MatDialog } from '@angular/material';
import { AccountService } from 'src/app/core/services/account.service';
import { Organization } from 'src/app/models/organization';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, debounceTime, pluck } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { ChangeOrgShortNamViewmodel } from 'src/app/models/viewmodels/change-org-short-nam-viewmodel';

@Component({
  selector: 'app-organizations',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('orgTableFilterInput') orgFilter: ElementRef;
  @ViewChild('changeOrgShortNameTemplate') changeOrgShortNameTemplate: TemplateRef<any>;
  @ViewChild('resetPasswordTemplate') resetPasswordTemplate: TemplateRef<any>;
  // 数据源
  orgDataSource: MatTableDataSource<Organization> = new MatTableDataSource<Organization>();
  // 总数
  totalOrgCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 当前过滤逻辑
  currentFileterData: string;
  // 显示的列
  displayedColumns: string[] = ['select', 'orgIdentifier', 'orgShortNam', 'orgLvl', 'upOrg', 'org2', 'orgNam2', 'roleNam'];
  // 当前选择的记录行
  selection: SelectionModel<Organization> = new SelectionModel<Organization>(true, []);
  // 修改机构简称的form
  changeOrgShortNameForm: FormGroup;
  constructor(private accountService: AccountService,
    private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder) { }
  onDataSourceChanged() {
    this.getOrgPagination();
  }
  ngOnInit() {
    /**添加分页逻辑 */
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getOrgPagination();
    });
    /**初始化表格参数 */
    this.initTableParameters();
    /**绑定input输入事件 */
    fromEvent(this.orgFilter.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.currentFileterData = filter;
        this.initPage();
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
    const apiUrl = `/api/auth/accounts`;
    let targetUrl = `${apiUrl}?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
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
      targetUrl = `${targetUrl}&filters=OrgFilter==${this.currentFileterData}`;
    }
    this.accountService.getOrgPagination(targetUrl).subscribe(response => {
      this.totalOrgCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.orgDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  /**判断是否直选中了一行 */
  isOneSelected() {
    return this.selection.selected.length === 1;
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
  openChangeOrgShortNameDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一行进行操作');
      return;
    }
    this.changeOrgShortNameForm = this.fb.group({
      orgShortNam: [this.selection.selected[0].orgShortNam,
      [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      orgIdentifier: [this.selection.selected[0].orgIdentifier, [Validators.required]],
    });
    this.dialog.open(this.changeOrgShortNameTemplate);
  }
  changeOrgShortName() {
    const viewModel: ChangeOrgShortNamViewmodel = this.changeOrgShortNameForm.value as ChangeOrgShortNamViewmodel;
    this.accountService.changeOrgShortName(viewModel).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.onDataSourceChanged();
      },
      error: (e: RequestActionModel) => this.alert.failure(e.message),
    });
  }
  openResetPasswordDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一行进行操作');
      return;
    }
    this.dialog.open(this.resetPasswordTemplate);
  }
  resetOrgPassword() {
    const resetPasswordViewmodel = {
      orgIdentifier: this.selection.selected[0].orgIdentifier,
    };
    this.accountService.resetOrgPassword(resetPasswordViewmodel).subscribe({
      next: (result: RequestActionModel) => this.alert.success(result.message),
      error: (e: RequestActionModel) => this.alert.failure(e.message)
    });
  }
  modifyOrgRole() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一行进行操作');
      return;
    }
  }
}
