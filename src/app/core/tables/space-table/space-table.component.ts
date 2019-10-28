import { Component, OnInit } from '@angular/core';
import { TableBaseComponent } from '../table-base/table-base.component';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { OrgSpaceService } from '../../services/org-space.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-space-table',
  templateUrl: './space-table.component.html',
  styleUrls: ['./space-table.component.scss']
})
export class SpaceTableComponent extends TableBaseComponent<OrgSpace> implements OnInit {
  // 显示的列
  displayedColumns: string[] = ['select', 'spaceName', 'spaceDescription', 'orgIdentifier', 'orgName'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private spaceService: OrgSpaceService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getSpacesPagination();
    });
    this.spaceService.dataSourceChanged.subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getSpacesPagination();
  }
  getSpacesPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.spaceService.getByUrl(targetUrl).subscribe(response => {
      console.log(response);
      this.totalCount = +response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
}
