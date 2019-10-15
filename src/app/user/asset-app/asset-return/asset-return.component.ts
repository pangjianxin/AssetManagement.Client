import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetReturningEvent } from 'src/app/models/dtos/asset-returning-event';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetReturningService } from 'src/app/core/services/asset-returning.service';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';

@Component({
  selector: 'app-asset-return',
  templateUrl: './asset-return.component.html',
  styleUrls: ['./asset-return.component.scss']
})
export class AssetReturnComponent implements OnInit {

  currentUserApiUrl = '/api/assetReturn/current/pagination';
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('revokeEventRef', { static: true }) revokeEventRef: TemplateRef<any>;
  currentSearchInput: string;
  selection: SelectionModel<AssetReturningEvent> = new SelectionModel<AssetReturningEvent>(true, []);
  constructor(private dialog: MatDialog,
    private alert: AlertService,
    private assetReturningService: AssetReturningService,
    private router: Router) { }

  ngOnInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.currentSearchInput = value;
      });
  }
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<AssetReturningEvent>) {
    this.selection = $event;
  }
  openRemoveApplicationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一项', '重新选择');
    } else {
      this.dialog.open(this.revokeEventRef);
    }
  }
  // 删除
  removeApplication() {
    const eventId = this.selection.selected[0].eventId;
    this.assetReturningService.remove(eventId).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetReturningService.dataSourceChangedSubject.next(true);
      },
      error: (value: RequestActionModel) => this.alert.failure(value.message)
    });
  }

}
