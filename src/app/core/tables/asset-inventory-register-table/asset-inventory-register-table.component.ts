import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';
import { AssetInventoryService } from '../../services/asset-inventory-service';
import { debounceTime } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-inventory-register-table',
  templateUrl: './asset-inventory-register-table.component.html',
  styleUrls: ['./asset-inventory-register-table.component.scss']
})
export class AssetInventoryRegisterTableComponent extends TableBaseComponent<AssetInventoryRegister> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'orgIdentifier', 'orgNam', 'org2', 'taskName',
    'taskComment', 'progress'];
  constructor(private assetInventoryService: AssetInventoryService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getInventoryRegisterPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.initPage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filter'].firstChange) {
      this.initPage();
    }
  }
  private getInventoryRegisterPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.assetInventoryService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = +response['@odata.count'];
      this.dataSource.data = response.value;
      console.log(this.dataSource.data);
      this.selection.clear();
    });
  }

}
