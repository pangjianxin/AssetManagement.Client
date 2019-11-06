import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetDeploy } from 'src/app/models/dtos/asset-deploy';
import { Observable, fromEvent } from 'rxjs';
import { Organization } from 'src/app/models/dtos/organization';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { debounceTime, distinctUntilChanged, pluck, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AssetDeployService } from 'src/app/core/services/asset-deploy.service';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  mapChartUrl: string;
  mapData: { name: string, value: number }[];
  assetDeployUrl: string;
  orgUrl: string;
  selection: SelectionModel<AssetDeploy> = new SelectionModel<AssetDeploy>(true, []);
  downLoadAssetDeployForm: FormGroup;
  importOrgs$: Observable<Organization[]>;
  exportOrgs$: Observable<Organization[]>;
  currentDate = new Date();
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('downloadAssetDeployFileRef', { static: true }) downloadAssetDeployFileRef: TemplateRef<any>;
  @ViewChild('downloadAssetDeployLink', { static: false }) downloadAssetDeployLink: ElementRef;
  constructor(
    private deployService: AssetDeployService,
    private alert: AlertService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private orgService: OrganizationService) { }
  ngOnInit(): void {
    this.mapChartUrl = 'assets/geoJson/neimenggu.json';
    this.mapData = [
      { name: '呼伦贝尔市', value: 102 },
      { name: '兴安盟', value: 115 },
      { name: '通辽市', value: 120 },
      { name: '赤峰市', value: 20 },
      { name: '锡林郭勒盟', value: 10 },
      { name: '乌兰察布市', value: 80 },
      { name: '呼和浩特市', value: 20 },
      { name: '包头市', value: 40 },
      { name: '巴彦淖尔市', value: 60 },
      { name: '鄂尔多斯市', value: 60 },
      { name: '阿拉善盟', value: 60 },
      { name: '乌海市', value: 60 },
    ];
    this.orgUrl = environment.apiBaseUrls.odata.organization;
    this.assetDeployUrl = environment.apiBaseUrls.odata.assetDeploy;
    this.downLoadAssetDeployForm = this.fb.group({
      startDate: [{ value: '' }, [Validators.required]],
      endDate: [{ value: '' }, [Validators.required]],
      importOrg: [null, [forbiddenString()]],
      exportOrg: [null, [forbiddenString()]],
    });
    this.importOrgs$ = this.downLoadAssetDeployForm.get('importOrg').valueChanges.pipe(debounceTime(300), switchMap((input: string) => {
      return this.orgService.getByUrl(`${this.orgUrl}?$filter=contains(orgIdentifier,'${input}') or contains(orgNam,'${input}')`)
        .pipe(map(result => result.value));
    }));
    this.exportOrgs$ = this.downLoadAssetDeployForm.get('exportOrg').valueChanges.pipe(debounceTime(300), switchMap((input: string) => {
      return this.orgService.getByUrl(`${this.orgUrl}?$filter=contains(orgIdentifier,'${input}') or contains(orgNam,'${input}')`)
        .pipe(map(result => result.value));
    }));
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
        importOrgId = this.downLoadAssetDeployForm.get('importOrg').value.id;
      }
      if (this.downLoadAssetDeployForm.get('exportOrg').value) {
        exportOrgId = this.downLoadAssetDeployForm.get('exportOrg').value.id;
      }
      const blob = await this.deployService.downloadAssetDeployFile(startDate, endDate, exportOrgId, importOrgId);
      const url = window.URL.createObjectURL(blob);
      const link = this.downloadAssetDeployLink.nativeElement;
      link.href = url;
      link.download = 'archive.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
  onAssetDeploySelectedEmitted($event: SelectionModel<AssetDeploy>) {
    this.selection = $event;
  }

}
