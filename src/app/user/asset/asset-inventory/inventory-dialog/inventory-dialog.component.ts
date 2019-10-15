import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
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
export enum AssetInventoryStatus {
  账面与实物相符 = 1,
  账面与实物不符 = 2,
  盘亏 = 3,
}
@Component({
  selector: 'app-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.scss']
})
export class InventoryDialogComponent implements OnInit {

  inventoryStatus = AssetInventoryStatus;
  @ViewChild('personInChargeInput', { static: true }) personInChargeInput: ElementRef;
  candidateEmployees$: Observable<Employee[]>;
  candidateLocations$: Observable<OrgSpace>;
  // 选择盘点状态表单
  selectInventoryStatusForm: FormGroup;
  // 输入盘点信息表单
  inputInventoryMessageForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { asset: Asset, assetStockTakingOrg: AssetInventoryRegister },
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private alert: AlertService,
    private orgSpaceService: OrgSpaceService,
    private assetInventoryService: AssetInventoryService,
    private assetService: AssetService) { }

  ngOnInit() {
    fromEvent(this.personInChargeInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.candidateEmployees$ = this.employeeService.getEmployeByName(value).pipe(map(actionModel => actionModel.data));
      });
    this.candidateLocations$ = this.orgSpaceService.getAllSpace().pipe(map(item => item.data));
    this.selectInventoryStatusForm = this.fb.group({
      inventoryStatus: ['', [Validators.required]]
    });
    this.inputInventoryMessageForm = this.fb.group({
      personInCharge: [null, [Validators.required]],
      message: ['', [Validators.required]],
      location: ['']
    });
  }
  displayFn(obj: Employee) {
    if (obj) {
      return `${obj.name}-${obj.identifier}`;
    }
    return null;
  }
  submitInventory() {
    const model: CreateAssetInventoryDetail = {
      assetId: this.data.asset.assetId,
      assetInventoryRegisterId: this.data.assetStockTakingOrg.id,
      responsibilityIdentity: this.inputInventoryMessageForm.get('personInCharge').value.identifier,
      responsibilityName: this.inputInventoryMessageForm.get('personInCharge').value.name,
      responsibilityOrg2: this.inputInventoryMessageForm.get('personInCharge').value.org2,
      assetInventoryLocation: this.inputInventoryMessageForm.get('location').value,
      message: this.inputInventoryMessageForm.get('message').value,
      inventoryStatus: this.selectInventoryStatusForm.get('inventoryStatus').value
    };
    console.log(model);
    this.assetInventoryService.createInventoryDetail(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
        this.assetInventoryService.dataSourceChangedSubject.next(true);
      },
      error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
    });
  }

}
