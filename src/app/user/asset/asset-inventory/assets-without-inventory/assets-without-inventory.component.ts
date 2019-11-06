import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort, MatDialog } from '@angular/material';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';
import { SelectionModel } from '@angular/cdk/collections';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-assets-without-inventory',
  templateUrl: './assets-without-inventory.component.html',
  styleUrls: ['./assets-without-inventory.component.scss']
})
export class AssetsWithoutInventoryComponent implements OnInit {
  assetTableUrl: string;
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  @Input() currentInventoryRegister: AssetInventoryRegister;
  @Output() selected = new EventEmitter<SelectionModel<Asset>>();
  /** Based on the screen size, switch from standard to one column per row */
  constructor(
    private dialog: MatDialog,
    private alert: AlertService) {
  }
  ngOnInit() {
    console.log(this.currentInventoryRegister.id);
    this.assetTableUrl = `${environment.apiBaseUrls.odata.asset_current_assetWithoutInventory}?$expand=assetCategoryDto&assetInventoryRegisterId=${this.currentInventoryRegister.id}`;
  }
  openAssetInventoryDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一项进行操作');
      return;
    }
    this.dialog.open(InventoryDialogComponent,
      { data: { asset: this.selection.selected[0], assetInventoryRegister: this.currentInventoryRegister } });
  }
  get isOneSelected(): boolean {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Asset>) {
    this.selection = $event;
  }
}
