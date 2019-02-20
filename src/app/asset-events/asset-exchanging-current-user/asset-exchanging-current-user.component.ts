import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetExchangingEvent } from 'src/app/models/asset-exchanging-event';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AssetExchangingService } from 'src/app/core/services/asset-exchanging-service';
import { AlertService } from 'src/app/core/services/alert.service';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-asset-exchanging-current-user',
  templateUrl: './asset-exchanging-current-user.component.html',
  styleUrls: ['./asset-exchanging-current-user.component.scss']
})
export class AssetExchangingCurrentUserComponent implements OnInit {

  assetExchangingCurrentUserUrl = '/api/assetExchange/current/pagination/';
  title = '资产机构简调拨申请(当前机构)';
  subtitle = '该页面显示当前机构产生的资产机构简调配事件，你拥有处理该事务的相应权限';
  currentSearchInput: string;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('removeEventRef') removeEventRef: TemplateRef<any>;
  currentSelection: SelectionModel<AssetExchangingEvent> = new SelectionModel<AssetExchangingEvent>(true, []);
  currentSelectedRow: AssetExchangingEvent;
  constructor(private dialog: MatDialog,
    private assetExchangeService: AssetExchangingService,
    private alert: AlertService) { }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.currentSearchInput = value);
  }
  onSelected($event) {
    this.currentSelection = $event;
  }
  get isOneSelected() {
    return this.currentSelection.selected.length === 1;
  }
  openRevokeEventDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一个选择项进行操作');
    } else {
      this.currentSelectedRow = this.currentSelection.selected[0];
      this.dialog.open(this.removeEventRef);
    }
  }
  removeEvent() {
    this.assetExchangeService.remove(this.currentSelectedRow.eventId).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetExchangeService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
}
