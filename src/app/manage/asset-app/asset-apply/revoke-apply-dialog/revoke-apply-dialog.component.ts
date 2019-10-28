import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AssetApply } from 'src/app/models/dtos/asset-apply';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-revoke-apply-dialog',
  templateUrl: './revoke-apply-dialog.component.html',
  styleUrls: ['./revoke-apply-dialog.component.scss']
})
export class RevokeApplyDialogComponent implements OnInit {
  revokeEventForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { assetApply: AssetApply },
    private alert: AlertService,
    private fb: FormBuilder,
    private assetApplyService: AssetApplyingService) { }

  ngOnInit() {
    this.revokeEventForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]]
    });

  }
  /**撤销事件的逻辑 */
  revokeEvent() {
    const eventId = this.data.assetApply.id;
    const message = this.revokeEventForm.get('message').value;
    this.assetApplyService.revoke(eventId, message).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetApplyService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }

}
