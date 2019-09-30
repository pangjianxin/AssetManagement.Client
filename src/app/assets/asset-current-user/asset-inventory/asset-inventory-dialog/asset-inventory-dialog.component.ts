import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AssetInventoryStatus } from 'src/app/models/dtos/asset-inventory-status';
import { Observable, fromEvent } from 'rxjs';
import { Employee } from 'src/app/models/dtos/employee';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { AssetInventoryService } from 'src/app/core/services/asset-inventory-service';
import { AssetService } from 'src/app/core/services/asset.service';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { CreateAssetInventoryDetail } from 'src/app/models/viewmodels/create-asset-inventory-detail';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-asset-inventory-dialog',
  templateUrl: './asset-inventory-dialog.component.html',
  styleUrls: ['./asset-inventory-dialog.component.scss']
})
export class AssetInventoryDialogComponent implements OnInit {

  StockTakingStatus = AssetInventoryStatus;
  @ViewChild('personInChargeInput', { static: true }) personInChargeInput: ElementRef;
  candidateEmployees$: Observable<Employee[]>;
  candidateLocations$: Observable<OrgSpace>;
  // 选择盘点状态表单
  selectStockTakingStatusForm: FormGroup;
  // 输入盘点信息表单
  inputStockTakingMessageForm: FormGroup;
  // 提交资产盘点结果form
  submitAssetStockTakingForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { asset: Asset, assetStockTakingOrg: AssetInventoryRegister },
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private alert: AlertService,
    private orgSpaceService: OrgSpaceService,
    private assetStockTakingService: AssetInventoryService,
    private assetService: AssetService) { }

  ngOnInit() {
    fromEvent(this.personInChargeInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.candidateEmployees$ = this.employeeService.getEmployeByName(value).pipe(map(actionModel => actionModel.data));
      });
    this.candidateLocations$ = this.orgSpaceService.getAllSpace().pipe(map(item => item.data));
    this.submitAssetStockTakingForm = this.fb.group({
      selectStockTakingStatusForm: this.fb.group({
        stockTakingStatus: ['', [Validators.required]]
      }),
      inputStockTakingMessageForm: this.fb.group({
        personInCharge: [null, [Validators.required]],
        message: ['', [Validators.required]],
        location: ['']
      })
    });
  }
  displayFn(obj: Employee) {
    if (obj) {
      return `${obj.name}-${obj.identifier}`;
    }
    return null;
  }
  submitStokTaking() {
    const model: CreateAssetInventoryDetail = {
      assetId: this.data.asset.assetId,
      assetStockTakingOrganizationId: this.data.assetStockTakingOrg.id,
      responsibilityIdentity: this.submitAssetStockTakingForm.get('inputStockTakingMessageForm').get('personInCharge').value.identifier,
      responsibilityName: this.submitAssetStockTakingForm.get('inputStockTakingMessageForm').get('personInCharge').value.name,
      responsibilityOrg2: this.submitAssetStockTakingForm.get('inputStockTakingMessageForm').get('personInCharge').value.org2,
      assetStockTakingLocation: this.submitAssetStockTakingForm.get('inputStockTakingMessageForm').get('location').value,
      message: this.submitAssetStockTakingForm.get('inputStockTakingMessageForm').get('message').value,
      stockTakingStatus: this.submitAssetStockTakingForm.get('selectStockTakingStatusForm').get('stockTakingStatus').value
    };
    this.assetStockTakingService.createAssetStockTakingDetail(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
    });
  }

}
