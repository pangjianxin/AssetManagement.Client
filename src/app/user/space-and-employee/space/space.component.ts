import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort, MatDialog } from '@angular/material';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { SelectionModel } from '@angular/cdk/collections';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { CreateOrgSpace } from 'src/app/models/viewmodels/create-org-space';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { ModifySpace } from 'src/app/models/viewmodels/modify-space';
import { environment } from '../../../../environments/environment';
import { TableBaseComponent } from 'src/app/core/tables/table-base/table-base.component';
@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
  tableUrl: string;
  filter: string;
  createSpaceForm: FormGroup;
  modifySpaceForm: FormGroup;
  selection: SelectionModel<OrgSpace> = new SelectionModel<OrgSpace>(true, []);
  @ViewChild('spaceSearchInput', { static: true }) spaceSearchInput: ElementRef;
  @ViewChild('modifySpaceDialog', { static: true }) modifySpaceDialog: TemplateRef<any>;
  @ViewChild('createSpaceDialog', { static: true }) createSpaceDialog: TemplateRef<any>;
  // 显示的列
  displayedColumns: string[] = ['select', 'spaceName', 'spaceDescription', 'orgIdentifier', 'orgName'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private spaceService: OrgSpaceService,
    private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder) {
    this.tableUrl = environment.apiBaseUrls.odata.orgSpace;
    this.filter = '';
  }
  ngOnInit() {
    fromEvent(this.spaceSearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.filter = value;
        this.spaceService.dataSourceChanged.next(true);
      });
    this.createSpaceForm = this.fb.group({
      spaceName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      spaceDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
    });
  }
  openModifySpaceDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一项进行操作');
    } else {
      this.modifySpaceForm = this.fb.group({
        spaceId: [this.selection.selected[0].id, [Validators.required]],
        spaceName: [this.selection.selected[0].spaceName, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
        spaceDescription: [this.selection.selected[0].spaceDescription,
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      });
      this.dialog.open(this.modifySpaceDialog);
    }
  }
  createSpace() {
    const model = this.createSpaceForm.value as CreateOrgSpace;
    this.spaceService.createSpace(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.spaceService.dataSourceChanged.next(true);
      },
      error: (e: ActionResult) => { this.alert.failure(e.message); }
    });
  }
  openCreateSpaceDialog() {
    this.dialog.open(this.createSpaceDialog);
  }
  modifySpace() {
    const model = this.modifySpaceForm.value as ModifySpace;
    this.spaceService.modifySpace(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.spaceService.dataSourceChanged.next(true);
      },
      error: (e: ActionResult) => {
        this.alert.failure(e.message);
      }
    });
  }
  isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<OrgSpace>) {
    this.selection = $event;
  }
}
