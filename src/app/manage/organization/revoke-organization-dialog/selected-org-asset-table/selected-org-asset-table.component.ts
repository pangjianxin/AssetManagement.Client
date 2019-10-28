import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { TableBaseComponent } from 'src/app/core/tables/table-base/table-base.component';
import { Organization } from 'src/app/models/dtos/organization';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-selected-org-asset-table',
  templateUrl: './selected-org-asset-table.component.html',
  styleUrls: ['./selected-org-asset-table.component.scss']
})
export class SelectedOrgAssetTableComponent extends TableBaseComponent<Asset> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['assetName', 'brand', 'assetNo', 'orgInUseIdentifier',
    'assetThirdLevelCategory', 'assetLocation'];
  constructor(
    private assetService: AssetService) {
    super();
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.getAssetPagination();
  }
  private getAssetPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    console.log(`getPagination`, targetUrl);
    this.assetService.getByUrl(targetUrl).subscribe(response => {
      if (response) {
        this.totalCount = response['@odata.count'];
        this.dataSource = response.value;
        this.selection.clear();
      }
    });
  }

}
