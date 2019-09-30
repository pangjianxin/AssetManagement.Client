import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';
import { Organization } from 'src/app/models/dtos/organization';
import { AssetInventoryService } from 'src/app/core/services/asset-inventory-service';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';

@Component({
  selector: 'app-asset-inventory',
  templateUrl: './asset-inventory.component.html',
  styleUrls: ['./asset-inventory.component.scss']
})
export class AssetInventoryComponent implements OnInit {

  @ViewChild('stockTakingYear', { static: true }) stockTakingYearInput: ElementRef;
  assetBaseUrl: string;
  stockTakingDetailUrl: string;
  filterData: string;
  stockTakingOrgHistories$: Observable<AssetInventoryRegister[]>;
  any$: Observable<boolean>;
  currentSelectedYear: number;
  currentOrg$: Observable<Organization>;
  constructor(private assetStockTakingService: AssetInventoryService) {
  }

  ngOnInit() {

    this.filterData = '';
    // 为当前年份赋予一个初始值
    this.currentSelectedYear = new Date().getFullYear();
    // 资产盘点年份input的事件绑定
    fromEvent(this.stockTakingYearInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: number) => {
        console.log(value);
        this.currentSelectedYear = value;
        this.any$ = this.assetStockTakingService.anyStockTaking(value).pipe(map(result => result.data));
      });
    this.any$ = this.assetStockTakingService.anyStockTakingOrgs(this.currentSelectedYear).pipe(map(result => result.data));
    // tslint:disable-next-line:max-line-length
    this.stockTakingOrgHistories$ = this.assetStockTakingService.currentStockTakingOrgsInYear(this.currentSelectedYear).pipe(map(item => item.data));
  }

}
