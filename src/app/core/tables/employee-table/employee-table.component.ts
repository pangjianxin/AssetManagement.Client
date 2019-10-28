import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { EmployeeService } from '../../services/employee.service';
import { TableBaseComponent } from '../table-base/table-base.component';
import { Employee } from 'src/app/models/dtos/employee';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent extends TableBaseComponent<Employee> implements OnInit {
  // 显示的列
  displayedColumns: string[] = ['select', 'name', 'identifier', 'org2', 'telephone', 'officePhone'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private employeeService: EmployeeService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getEmployeePagination();
    });
    this.employeeService.dataSourceChanged.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getEmployeePagination();
  }
  getEmployeePagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.employeeService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }


}
