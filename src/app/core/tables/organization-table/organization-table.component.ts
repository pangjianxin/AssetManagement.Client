import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Organization } from 'src/app/models/dtos/organization';
import { debounceTime } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { OrganizationService } from '../../services/organization.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-table',
  templateUrl: './organization-table.component.html',
  styleUrls: ['./organization-table.component.scss']
})
export class OrganizationTableComponent extends TableBaseComponent<Organization> implements OnInit, OnChanges {
  // 显示的列
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['select', 'orgIdentifier', 'orgShortNam', 'orgLvl', 'orgNam', 'upOrg', 'org2', 'orgNam2', 'roleDescription'];
  constructor(private orgService: OrganizationService) {
    super();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['filter'].firstChange) {
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
    this.orgService.dataSourceChanged.subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    /**初始化数据 */
    this.getOrgPagination();
  }
  // 获取分页数据
  getOrgPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.orgService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = +response['@odata.count'];
      this.dataSource.data = response.value as Organization[];
    });
  }

}
