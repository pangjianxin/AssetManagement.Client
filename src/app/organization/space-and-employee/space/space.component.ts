import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { SelectionModel } from '@angular/cdk/collections';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { CreateOrgSpace } from 'src/app/models/viewmodels/create-org-space';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { ModifySpace } from 'src/app/models/viewmodels/modify-space';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {

  apiUrl = '/api/orgspace/pagination';
  currentFileterData = '';
  createSpaceForm: FormGroup;
  modifySpaceForm: FormGroup;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('matSortSpacesTable', { static: true }) spacesSort: MatSort;
  @ViewChild('spaceSearchInput', { static: true }) spaceSearchInput: ElementRef;
  @ViewChild('modifySpaceDialog', { static: true }) modifySpaceDialog: TemplateRef<any>;
  @ViewChild('createSpaceDialog', { static: true }) createSpaceDialog: TemplateRef<any>;
  spaceDataSource: MatTableDataSource<OrgSpace> = new MatTableDataSource<OrgSpace>();
  // 总数
  totalSpacesCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'spaceName', 'spaceDescription', 'orgIdentifier', 'orgName'];
  // 当前选择的记录行
  selection: SelectionModel<OrgSpace> = new SelectionModel<OrgSpace>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private spaceService: OrgSpaceService,
    private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder) {
  }
  ngOnInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getSpacesPagination();
    });
    this.initTableParameters();
    fromEvent(this.spaceSearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.currentFileterData = value;
        this.initPage();
      });
    this.getSpacesPagination();
    this.createSpaceForm = this.fb.group({
      spaceName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      spaceDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
    });
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
  /**判断是否直选中了一行 */
  isOneSelected() {
    return this.selection.selected.length === 1;
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.spaceDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.spaceDataSource.data.forEach(row => this.selection.select(row));
  }
  /**排序事件处理handler */
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  getSpacesPagination() {
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
      targetUrl = `${targetUrl}&filters=OrgSpaceFilter==${this.currentFileterData}`;
    }
    this.spaceService.getSpacePagination(targetUrl).subscribe(response => {
      this.totalSpacesCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.spaceDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  openModifySpaceDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一项进行操作');
    } else {
      this.modifySpaceForm = this.fb.group({
        spaceId: [this.selection.selected[0].spaceId, [Validators.required]],
        spaceName: [this.selection.selected[0].spaceName, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
        spaceDescription: [this.selection.selected[0].spaceDescription,
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      });
      this.dialog.open(this.modifySpaceDialog);
    }
  }
  createSpace() {
    const model = this.createSpaceForm.value as CreateOrgSpace;
    this.spaceService.createSpace(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.onDataSourceChanged();
      },
      error: (e: RequestActionModel) => { this.alert.failure(e.message); }
    });
  }
  openCreateSpaceDialog() {
    this.dialog.open(this.createSpaceDialog);
  }
  modifySpace() {
    const model = this.modifySpaceForm.value as ModifySpace;
    this.spaceService.modifySpace(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.onDataSourceChanged();
      },
      error: (e: RequestActionModel) => {
        this.alert.failure(e.message);
      }
    });
  }
  onDataSourceChanged() {
    this.getSpacesPagination();
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }

}
