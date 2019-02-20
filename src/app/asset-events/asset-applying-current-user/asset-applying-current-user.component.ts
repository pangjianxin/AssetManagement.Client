import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, distinctUntilChanged } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApplyingEvent } from 'src/app/models/asset-applying-event';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { MatDialog } from '@angular/material';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { AssetApplyingTableComponent } from '../asset-applying-table/asset-applying-table.component';

@Component({
  selector: 'app-asset-applying-current-user',
  templateUrl: './asset-applying-current-user.component.html',
  styleUrls: ['./asset-applying-current-user.component.scss']
})
export class AssetApplyingCurrentUserComponent implements OnInit {
  assetApplyingCurrnetUserUrl = '/api/assetApply/current/pagination';
  userTitle = '资产申请事件(当前机构)';
  userSubTitle = '当前机构的资产申请历史记录，可执行删除等操作';
  searchInputContent: string;
  selection: SelectionModel<AssetApplyingEvent> = new SelectionModel<AssetApplyingEvent>(true, []);
  currentSelectedRow: AssetApplyingEvent;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('removeEventRef') removeEventRef: TemplateRef<any>;
  constructor(private alert: AlertService,
    private assetApplyingService: AssetApplyingService,
    private dialog: MatDialog) { }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.searchInputContent = value);
  }
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($evnet: SelectionModel<AssetApplyingEvent>) {
    this.selection = $evnet;
  }
  openRemoveEventDialogRef() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一个选项进行操作');
    } else {
      this.currentSelectedRow = this.selection.selected[0];
      this.dialog.open(this.removeEventRef);
    }
  }
  removeEvent() {
    this.assetApplyingService.remove(this.currentSelectedRow.eventId).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetApplyingService.dataSourceChangedSubject.next(true);
      },
      error: (value: RequestActionModel) => this.alert.failure(value.message)
    });
  }

}
