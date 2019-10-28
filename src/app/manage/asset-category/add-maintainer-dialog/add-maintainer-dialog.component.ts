import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AssetCategory } from 'src/app/models/dtos/asset-category';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AddMaintainer } from 'src/app/models/viewmodels/add-maintainer';
import { MaintainerService } from 'src/app/core/services/maintainer.service';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { AlertService } from 'src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-maintainer-dialog',
  templateUrl: './add-maintainer-dialog.component.html',
  styleUrls: ['./add-maintainer-dialog.component.scss']
})
export class AddMaintainerDialogComponent implements OnInit {
  addMaintainerForm: FormGroup;
  @Input() currentCategory: AssetCategory;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { currentCategory: AssetCategory },
    private fb: FormBuilder,
    private maintainerService: MaintainerService,
    private alert: AlertService) {

  }

  ngOnInit() {
    this.addMaintainerForm = this.fb.group({
      assetCategoryId: [this.data.currentCategory.id, [Validators.required]],
      companyName: ['', [Validators.required]],
      maintainerName: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      officePhone: ['']
    });
  }
  /**
   * 添加服务商
   */
  addMaintainer() {
    const model: AddMaintainer = this.addMaintainerForm.value as AddMaintainer;
    this.maintainerService.addMaintainer(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alert.failure(error.error.message);
      }
    });
  }

}
