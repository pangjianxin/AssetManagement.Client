import { Component, OnInit } from '@angular/core';
import { TableBaseComponent } from '../table-base/table-base.component';
import { AssetInventoryDetail } from 'src/app/models/dtos/asset-inventory-detail';
import { PageEvent } from '@angular/material';
import { InvnetoryDetailService as InventoryDetailService } from '../../services/invnetory-detail.service';

@Component({
  selector: 'app-asset-inventory-detail-table',
  templateUrl: './asset-inventory-detail-table.component.html',
  styleUrls: ['./asset-inventory-detail-table.component.scss']
})
export class AssetInventoryDetailTableComponent extends TableBaseComponent<AssetInventoryDetail> implements OnInit {

  // 显示的列
  displayedColumns: string[] = ['responsibilityIdentity', 'responsibilityName', 'responsibilityOrg2', 'assetInventoryLocation',
    'assetName', 'assetDescription', 'assetTagNumber', 'inventoryStatus'];
  constructor(private inventoryDetailService: InventoryDetailService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getDetailPagination();
    });
    this.inventoryDetailService.dataSourceChanged.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.initPage();
  }
  private getDetailPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    // 最终的URL执行分页功能
    this.inventoryDetailService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
}
