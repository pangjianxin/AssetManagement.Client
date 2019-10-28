import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatDialog } from '@angular/material';
import { Employee } from 'src/app/models/dtos/employee';
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { AddEmployee } from 'src/app/models/viewmodels/add-employee';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  tableUrl: string;
  filter: string;
  addEmployeeForm: FormGroup;
  modifyEmployeeForm: FormGroup;
  selection: SelectionModel<Employee> = new SelectionModel<Employee>(true, []);
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('empployeeSearchInput', { static: true }) empployeeSearchInput: ElementRef;
  @ViewChild('modifyEmployeeDialog', { static: true }) modifyEmployeeDialog: TemplateRef<any>;
  @ViewChild('addEmployeeDialog', { static: true }) addEmployeeDialog: TemplateRef<any>;

  // 显示的列
  displayedColumns: string[] = ['select', 'name', 'identifier', 'org2', 'telephone', 'officePhone'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private employeeService: EmployeeService,
    private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder) {
    this.tableUrl = environment.apiBaseUrls.odata.employee;
    this.filter = '';
  }
  ngOnInit() {
    fromEvent(this.empployeeSearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.filter = this.manipulateOdataFilter(value);
        this.employeeService.dataSourceChanged.next(true);
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
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.employeeService.dataSourceChanged.next(true);
      },
      error: (e: HttpErrorResponse) => this.alert.failure(e.error)
    });
  }
  openModifyEmployeeDialog() {
    if (this.isOneSelected) {
      this.alert.warn('you can only select one line on modify the employees information');
    }
    this.alert.warn('not emplements');
  }
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Employee>) {
    this.selection = $event;
  }
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(identifier,'${input}') or contains(name,'${input}')`;
    }
    return '';
  }

}
