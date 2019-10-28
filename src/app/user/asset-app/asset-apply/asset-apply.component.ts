import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApply } from 'src/app/models/dtos/asset-apply';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { MatDialog } from '@angular/material';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-apply',
  templateUrl: './asset-apply.component.html',
  styleUrls: ['./asset-apply.component.scss']
})
export class AssetApplyComponent implements OnInit {

  assetApplyUrl: string;
  searchInputContent: string;
  selection: SelectionModel<AssetApply> = new SelectionModel<AssetApply>(true, []);
  currentSelectedRow: AssetApply;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('removeEventRef', { static: true }) removeEventRef: TemplateRef<any>;
  constructor(private alert: AlertService,
    private assetApplyingService: AssetApplyingService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.assetApplyUrl = environment.apiBaseUrls.odata.assetApply_current;
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        if (value.length < 2) {
          this.searchInputContent = '';
          return;
        }
        this.searchInputContent = this.manipulateOdataFiter(value);
      });
  }
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($evnet: SelectionModel<AssetApply>) {
    this.selection = $evnet;
  }
  openRemoveApplicationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一个选项进行操作');
    } else {
      this.currentSelectedRow = this.selection.selected[0];
      this.dialog.open(this.removeEventRef);
    }
  }
  removeApplication() {
    this.assetApplyingService.remove(this.currentSelectedRow.id).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetApplyingService.dataSourceChangedSubject.next(true);
      },
      error: (value: ActionResult) => this.alert.failure(value.message)
    });
  }
  manipulateOdataFiter(input: string) {
    if (input) {
      return `$filter=contains(requestOrgIdentifier,'${input}') or contains(requestOrgNam,'${input}')`;
    } return '';
  }

}
