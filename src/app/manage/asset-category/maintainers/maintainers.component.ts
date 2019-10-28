import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DeleteMaintainer } from 'src/app/models/viewmodels/delete-maintainer';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { Maintainer } from 'src/app/models/dtos/maintainer';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material';
import { MaintainerService } from 'src/app/core/services/maintainer.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maintainers',
  templateUrl: './maintainers.component.html',
  styleUrls: ['./maintainers.component.scss']
})
export class MaintainersComponent implements OnInit {
  // 服务提供商url
  maintainersUrl: string;
  @ViewChild('deleteMaintainerRef', { static: true }) deleteMaintainerRef: TemplateRef<any>;
  // 当前服务商selection
  maintainerSelection: SelectionModel<Maintainer> = new SelectionModel<Maintainer>(true, []);
  constructor(private alert: AlertService,
    private dialog: MatDialog,
    private maintainerService: MaintainerService) { }

  ngOnInit() {
    this.maintainersUrl = environment.apiBaseUrls.odata.maintainer_manage;
  }
  isMaintainerOneSelected() {
    return this.maintainerSelection.selected.length === 1;
  }
  /**
     * 打开删除服务商的对话框
     */
  openDeleteMaintainerDialog() {
    if (!this.isMaintainerOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
      return;
    }
    this.dialog.open(this.deleteMaintainerRef);
  }
  /**
   * 删除服务商
   */
  deleteMaintainer() {
    const model: DeleteMaintainer = {
      maintainerId: this.maintainerSelection.selected[0].id
    };
    this.maintainerService.deleteMaintainer(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.maintainerService.dataSourceChangeSubject.next(true);
      },
      error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
    });
  }
  /**
  * 处理服务商表的选择事件
  * @param $event  传入的服务商列表
  */
  onMaintainerSelected($event: SelectionModel<Maintainer>) {
    this.maintainerSelection = $event;
  }
}
