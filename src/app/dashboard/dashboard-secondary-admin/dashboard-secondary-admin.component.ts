import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { AlertService } from 'src/app/core/services/alert.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { AssetDeploy } from 'src/app/models/dtos/asset-deploy';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { Organization } from 'src/app/models/dtos/organization';
export function forbiddenString(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value === 'string') {
      if (control.value === '') {
        return null;
      }
      return { 'forbiddenString': 'value not allowed string' };
    }
    return null;
  };
}
@Component({
  selector: 'app-dashboard-secondary-admin',
  templateUrl: './dashboard-secondary-admin.component.html',
  styleUrls: ['./dashboard-secondary-admin.component.scss']
})
export class DashboardSecondaryAdminComponent implements OnInit {
  assetCategoryByThirdLevelDataset: Array<{ name: string, value: number }>;
  assetCategoryByStatusDataset: Array<{ name: string, value: number }>;
  assetTableUrl: string;
  assetDeployUrl = '/api/dashboard/secondaryadmin/assetdeploy/pagination';
  currentAssetThirdLevel: string;
  currentAssetStatus: string;
  currentSearchInput: string;
  selection: SelectionModel<AssetDeploy> = new SelectionModel<AssetDeploy>(true, []);
  downLoadAssetDeployForm: FormGroup;
  importOrgs$: Observable<Organization[]>;
  exportOrgs$: Observable<Organization[]>;
  currentDate = new Date();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('downloadAssetDeployFileRef', { static: true }) downloadAssetDeployFileRef: TemplateRef<any>;
  @ViewChild('downloadAssetDeployLink', { static: false }) downloadAssetDeployLink: ElementRef;
  constructor(
    private dashboardService: DashboardService,
    private alert: AlertService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private orgService: OrganizationService) { }
  ngOnInit(): void {
    this.assetTableUrl = `/api/dashboard/secondaryadmin/assets/pagination`;
    this.dashboardService.getSecondaryAssetCategories().subscribe({
      next: (value: RequestActionModel) => {
        this.assetCategoryByThirdLevelDataset = value.data.categoriesByThirdLevel;
        this.assetCategoryByStatusDataset = value.data.categoriesByStatus;
      }
    });
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.currentSearchInput = value);
    this.downLoadAssetDeployForm = this.fb.group({
      startDate: [{ value: '' }, [Validators.required]],
      endDate: [{ value: '' }, [Validators.required]],
      importOrg: [null, [forbiddenString()]],
      exportOrg: [null, [forbiddenString()]],
    });
    this.downLoadAssetDeployForm.get('importOrg').valueChanges.pipe(debounceTime(300)).subscribe(input => {
      this.importOrgs$ = this.orgService.getOrgsBySearchInput(input).pipe(map(value => value.data));
    });
    this.downLoadAssetDeployForm.get('exportOrg').valueChanges.pipe(debounceTime(300)).subscribe(input => {
      this.exportOrgs$ = this.orgService.getOrgsBySearchInput(input).pipe(map(value => value.data));
    });
  }
  onThirdLevelEmitted($event) {
    this.currentAssetThirdLevel = $event;
  }
  onStatusEmitted($event) {
    this.currentAssetStatus = $event;
  }
  onAssetDeploySelectedEmitted($event: SelectionModel<AssetDeploy>) {
    this.selection = $event;
  }
  displayOrg(org: Organization) {
    if (org) {
      return `${org.orgNam}`;
    } else {
      return ``;
    }
  }
  openDownloadAssetDeployFileRef() {
    this.dialog.open(this.downloadAssetDeployFileRef);
  }
  async downloadAssetDeployFile() {
    if (this.downLoadAssetDeployForm.get('startDate').value > this.downLoadAssetDeployForm.get('endDate').value) {
      this.alert.warn('起始日期不能大于结束日期');
    } else {
      const startDate = this.downLoadAssetDeployForm.get('startDate').value.format('YYYY-MM-DD');
      const endDate = this.downLoadAssetDeployForm.get('endDate').value.format('YYYY-MM-DD');
      let importOrgId = '';
      let exportOrgId = '';
      if (this.downLoadAssetDeployForm.get('importOrg').value) {
        importOrgId = this.downLoadAssetDeployForm.get('importOrg').value.orgId;
      }
      if (this.downLoadAssetDeployForm.get('exportOrg').value) {
        exportOrgId = this.downLoadAssetDeployForm.get('exportOrg').value.orgId;
      }
      const blob = await this.dashboardService.downloadAssetDeployFile(startDate, endDate, exportOrgId, importOrgId);
      const url = window.URL.createObjectURL(blob);
      const link = this.downloadAssetDeployLink.nativeElement;
      link.href = url;
      link.download = 'archive.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
