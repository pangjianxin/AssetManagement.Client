import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { Employee } from 'src/app/models/dtos/employee';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { AddEmployee } from 'src/app/models/viewmodels/add-employee';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  apiUrl = '/api/employee/current/pagination';
  currentFileterData = '';
  addEmployeeForm: FormGroup;
  modifyEmployeeForm: FormGroup;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('empployeeSearchInput', { static: true }) empployeeSearchInput: ElementRef;
  @ViewChild('modifyEmployeeDialog', { static: true }) modifyEmployeeDialog: TemplateRef<any>;
  @ViewChild('addEmployeeDialog', { static: true }) addEmployeeDialog: TemplateRef<any>;
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'name', 'identifier', 'org2', 'telephone', 'officePhone'];
  // 当前选择的记录行
  selection: SelectionModel<Employee> = new SelectionModel<Employee>(true, []);
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private employeeService: EmployeeService,
    private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getEmployeePagination();
    });
    fromEvent(this.empployeeSearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.currentFileterData = value;
        this.initPage();
      });
    this.employeeService.dataSourceChangedBus.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getEmployeePagination();
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
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /**排序事件处理handler */
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  getEmployeePagination() {
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
      targetUrl = `${targetUrl}&filters=EmployeeFilter==${this.currentFileterData}`;
    }
    this.employeeService.pagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.dataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  /**
   * 增加员工的对话框
   */
  openAddEmployeeDialog() {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      identifier: ['', Validators.required],
      telephone: [''],
      officePhone: ['']
    });
    this.dialog.open(this.addEmployeeDialog);
  }
  addEmployee() {
    console.log('submit');
    const model = this.addEmployeeForm.value as AddEmployee;
    this.employeeService.addEmployee(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.employeeService.dataSourceChangedBus.next(true);
      },
      error: (e: HttpErrorResponse) => this.alert.failure(e.error)
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
  openModifyEmployeeDialog() {
    this.alert.warn('not emplements');
  }
}
