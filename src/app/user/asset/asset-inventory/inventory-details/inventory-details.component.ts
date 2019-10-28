import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort, MatDialog } from '@angular/material';
import { AssetInventoryDetail } from 'src/app/models/dtos/asset-inventory-detail';
import { AssetService } from 'src/app/core/services/asset.service';
import { AssetInventoryService } from 'src/app/core/services/asset-inventory-service';
import { environment } from 'src/environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit {
  inventoryDetailUrl: string;
  selection: SelectionModel<AssetInventoryDetail> = new SelectionModel<AssetInventoryDetail>(true, []);
  @Input() currentInventoryRegister: AssetInventoryRegister;
  constructor(private assetService: AssetService,
    private assetStockTakingService: AssetInventoryService,
    private dialog: MatDialog) {
  }
  ngOnInit() {
    this.inventoryDetailUrl
      = `${environment.apiBaseUrls.odata.assetInventoryDetail_current}?assetInventoryRegisterId=${this.currentInventoryRegister.id}`;
  }
  onSelected($event: SelectionModel<AssetInventoryDetail>) {
    this.selection = $event;
  }
  get isOneSelected(): boolean {
    return this.selection.selected.length === 1;
  }
}
