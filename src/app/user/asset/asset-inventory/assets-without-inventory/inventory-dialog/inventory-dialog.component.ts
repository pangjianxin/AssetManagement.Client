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
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InvnetoryDetailService } from 'src/app/core/services/invnetory-detail.service';
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
  orgSpaceUrl: string;
  employeeUrl: string;
  inventoryStatus = AssetInventoryStatus;
  @ViewChild('personInChargeInput', { static: true }) personInChargeInput: ElementRef;
  candidateEmployees$: Observable<Employee[]>;
  candidateLocations$: Observable<OrgSpace>;
  // 选择盘点状态表单
  selectInventoryStatusForm: FormGroup;
  // 输入盘点信息表单
  inputInventoryMessageForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { asset: Asset, assetInventoryRegister: AssetInventoryRegister },
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private alert: AlertService,
    private orgSpaceService: OrgSpaceService,
    private assetService: AssetService,
    private invnetoryDetailService: InvnetoryDetailService) {
    this.orgSpaceUrl = environment.apiBaseUrls.odata.orgSpace;
    this.employeeUrl = environment.apiBaseUrls.odata.employee;
  }

  ngOnInit() {
    fromEvent(this.personInChargeInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.candidateEmployees$ = this.employeeService.getByUrl(`${this.employeeUrl}?$filter=contains(name,'${value}') or contains(identifier,'${value}')`)
          .pipe(map(result => result.value));
      });
    this.candidateLocations$ = this.orgSpaceService.getByUrl(this.orgSpaceUrl).pipe(map(item => item.value));
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
      assetId: this.data.asset.id,
      assetInventoryRegisterId: this.data.assetInventoryRegister.id,
      responsibilityIdentity: this.inputInventoryMessageForm.get('personInCharge').value.identifier,
      responsibilityName: this.inputInventoryMessageForm.get('personInCharge').value.name,
      responsibilityOrg2: this.inputInventoryMessageForm.get('personInCharge').value.org2,
      assetInventoryLocation: this.inputInventoryMessageForm.get('location').value,
      message: this.inputInventoryMessageForm.get('message').value,
      inventoryStatus: this.selectInventoryStatusForm.get('inventoryStatus').value
    };
    this.invnetoryDetailService.createInventoryDetail(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
        this.invnetoryDetailService.dataSourceChanged.next(true);
      },
      error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
    });
  }

}
