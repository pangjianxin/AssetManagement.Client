import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetExchange } from 'src/app/models/dtos/asset-exchange';
import { AssetExchangingService } from '../../services/asset-exchanging-service';
import { debounceTime } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-exchange-table',
  templateUrl: './asset-exchange-table.component.html',
  styleUrls: ['./asset-exchange-table.component.scss']
})
export class AssetExchangeTableComponent extends TableBaseComponent<AssetExchange> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'status',
    'requestOrgIdentifier', 'requestOrgNam', 'org2', 'targetOrgIdentifier',
    'targetOrgNam', 'exchangeOrgIdentifier', 'exchangeOrgNam', 'assetName', 'message'];
  constructor(private assetExchangeService: AssetExchangingService) {
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
    this.assetExchangeService.dataSourceChangedSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
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
    this.assetExchangeService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }

}
