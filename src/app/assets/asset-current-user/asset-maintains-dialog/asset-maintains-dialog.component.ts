import { Component, OnInit, Inject } from '@angular/core';
import { Maintainer } from 'src/app/models/maintainer';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MaintainerService } from 'src/app/core/services/maintainer.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apply-maintaining-dialog',
  templateUrl: './asset-maintains-dialog.component.html',
  styleUrls: ['./asset-maintains-dialog.component.scss']
})
export class AssetMaintainsDialogComponent implements OnInit {
  selectedMaintainer: Maintainer;
  /**目标服务商（根据选中的资产的资产分类ID） */
  targetMaintainers$: Observable<Maintainer[]>;
  /**查看是否有任何维修商 */
  anyMaintainers$: Observable<boolean>;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private maintainerService: MaintainerService) { }

  ngOnInit() {
    this.anyMaintainers$ = this.maintainerService
      .anyMaintainer(this.data.asset.assetCategoryDto.assetCategoryId)
      .pipe(map(value => value.data));
    this.targetMaintainers$ = this.maintainerService
      .getMaintainersByCategoryid(this.data.asset.assetCategoryDto.assetCategoryId)
      .pipe(map(value => value.data));
  }
}
