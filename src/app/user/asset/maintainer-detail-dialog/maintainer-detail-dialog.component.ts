import { Component, OnInit, Inject } from '@angular/core';
import { Maintainer } from 'src/app/models/dtos/maintainer';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MaintainerService } from 'src/app/core/services/maintainer.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maintainer-detail-dialog',
  templateUrl: './maintainer-detail-dialog.component.html',
  styleUrls: ['./maintainer-detail-dialog.component.scss']
})
export class MaintainerDetailDialogComponent implements OnInit {
  maintainerUrl: string;
  selectedMaintainer: Maintainer;
  /**目标服务商（根据选中的资产的资产分类ID） */
  targetMaintainers$: Observable<Maintainer[]>;
  /**查看是否有任何维修商 */
  anyMaintainers: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private maintainerService: MaintainerService) {
    this.maintainerUrl = environment.apiBaseUrls.odata.maintainer_current;
    this.anyMaintainers = false;
  }

  ngOnInit() {
    this.targetMaintainers$ = this.maintainerService.getByUrl(`${this.maintainerUrl}?$count=true&$filter=AssetCategoryId=${this.data.asset.assetCategoryDto.id}`)
      .pipe(map(it => {
        if (it) {
          if (+it['@odata.count'] > 0) {
            this.anyMaintainers = true;
            return it.value;
          }
        }
      }));
  }

}
