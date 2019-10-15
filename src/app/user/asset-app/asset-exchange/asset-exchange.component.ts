import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetExchangingEvent } from 'src/app/models/dtos/asset-exchanging-event';
import { MatDialog } from '@angular/material';
import { AssetExchangingService } from 'src/app/core/services/asset-exchanging-service';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-asset-exchange',
  templateUrl: './asset-exchange.component.html',
  styleUrls: ['./asset-exchange.component.scss']
})
export class AssetExchangeComponent implements OnInit {

  assetExchangingCurrentUserUrl = '/api/assetExchange/current/pagination/';
  currentSearchInput: string;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('removeEventRef', { static: true }) removeEventRef: TemplateRef<any>;
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
  openRemoveApplicationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一个选择项进行操作');
    } else {
      this.currentSelectedRow = this.currentSelection.selected[0];
      this.dialog.open(this.removeEventRef);
    }
  }
  removeApplication() {
    this.assetExchangeService.remove(this.currentSelectedRow.eventId).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetExchangeService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }

}
