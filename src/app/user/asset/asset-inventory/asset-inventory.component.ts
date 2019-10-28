import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';
import { Organization } from 'src/app/models/dtos/organization';
import { AssetInventoryService } from 'src/app/core/services/asset-inventory-service';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { AssetService } from 'src/app/core/services/asset.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-inventory',
  templateUrl: './asset-inventory.component.html',
  styleUrls: ['./asset-inventory.component.scss']
})
export class AssetInventoryComponent implements OnInit {

  @ViewChild('stockTakingYear', { static: true }) stockTakingYearInput: ElementRef;
  inventoryRegisterUrl: string;
  any: boolean;
  filterData: string;
  inventoryHistories: AssetInventoryRegister[];
  currentSelectedYear: number;

  // ?
  currentOrg$: Observable<Organization>;
  constructor(private assetInventoryService: AssetInventoryService) {
    this.inventoryRegisterUrl = environment.apiBaseUrls.odata.assetInventoryRegister_current;
    this.any = false;
    // 为当前年份赋予一个初始值
    this.currentSelectedYear = new Date().getFullYear();
    this.filterData = '';
  }

  ngOnInit() {
    // 资产盘点年份input的事件绑定
    fromEvent(this.stockTakingYearInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: number) => {
        if (value < 2000) {
          return;
        }
        this.currentSelectedYear = value;
        this.getInventoryHistories();
      });
    this.getInventoryHistories();
  }
  getInventoryHistories() {
    this.assetInventoryService.getByUrl(`${this.inventoryRegisterUrl}?$count=true&$expand=assetInventory,participation&year=${this.currentSelectedYear}`)
      .subscribe(result => {
        if (result) {
          if (+result['@odata.count'] > 0) {
            this.any = true;
            this.inventoryHistories = result.value as AssetInventoryRegister[];
            console.log(this.inventoryHistories);
          } else {
            this.any = false;
            this.inventoryHistories = [];
          }
        }
      });
  }
}

