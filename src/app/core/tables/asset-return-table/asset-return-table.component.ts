import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApply } from 'src/app/models/dtos/asset-apply';
import { AssetReturningService } from '../../services/asset-returning.service';
import { debounceTime, filter } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { AssetReturn } from 'src/app/models/dtos/asset-return';

@Component({
  selector: 'app-asset-return-table',
  templateUrl: './asset-return-table.component.html',
  styleUrls: ['./asset-return-table.component.scss']
})
export class AssetReturnTableComponent extends TableBaseComponent<AssetReturn> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'status', 'assetName', 'requestOrgIdentifier', 'requestOrgNam',
    'org2', 'targetOrgIdentifier', 'targetOrgNam', 'message'];
  constructor(private assetReturnService: AssetReturningService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.assetReturnService.dataSourceChangedSubject.subscribe(value => {
      if (value) {
        this.getPagination();
      }
    });
    this.getPagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filter'].firstChange) {
      this.initPage();
    }
  }
  getPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.assetReturnService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
}
