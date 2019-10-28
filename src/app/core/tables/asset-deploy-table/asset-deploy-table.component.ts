import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetDeploy } from 'src/app/models/dtos/asset-deploy';
import { AssetService } from '../../services/asset.service';
import { debounceTime } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { environment } from 'src/environments/environment';
import { AssetDeployService } from '../../services/asset-deploy.service';

@Component({
  selector: 'app-asset-deploy-table',
  templateUrl: './asset-deploy-table.component.html',
  styleUrls: ['./asset-deploy-table.component.scss']
})
export class AssetDeployTableComponent extends TableBaseComponent<AssetDeploy> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'assetDeployCategory', 'assetName', 'exportOrgIdentifier',
    'exportOrgNam', 'importOrgIdentifier', 'importOrgNam', 'authorizeOrgIdentifier', 'authorizeOrgNam'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private assetService: AssetDeployService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetDeployPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.assetService.dataSourceChanged.subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getAssetDeployPagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filter'].firstChange) {
      this.initPage();
    }
  }

  private getAssetDeployPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.assetService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }

}
