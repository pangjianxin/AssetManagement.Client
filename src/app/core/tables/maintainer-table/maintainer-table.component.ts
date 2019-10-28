import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Maintainer } from 'src/app/models/dtos/maintainer';
import { MaintainerService } from '../../services/maintainer.service';
import { debounceTime } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';

@Component({
  selector: 'app-maintainer-table',
  templateUrl: './maintainer-table.component.html',
  styleUrls: ['./maintainer-table.component.scss']
})
export class MaintainerTableComponent extends TableBaseComponent<Maintainer> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'companyName', 'maintainerName', 'telephone', 'officePhone',
    'org2', 'categoryFirstLevel', 'categorySecondLevel', 'categoryThirdLevel'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private maintainerService: MaintainerService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getMaintainerPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.maintainerService.dataSourceChangeSubject.subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getMaintainerPagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentFileterData'] && !changes['currentFileterData'].firstChange) {
      this.initPage();
    }
  }
  private getMaintainerPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    // 最终的URL执行分页功能
    this.maintainerService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
}
