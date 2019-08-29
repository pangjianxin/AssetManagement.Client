import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetReturningEvent } from 'src/app/models/asset-returning-event';
import { distinctUntilChanged, pluck, debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetReturningService } from 'src/app/core/services/asset-returning.service';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { AssetReturningTableComponent } from '../asset-returning-table/asset-returning-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-returning-current-user',
  templateUrl: './asset-returning-current-user.component.html',
  styleUrls: ['./asset-returning-current-user.component.scss']
})
export class AssetReturningCurrentUserComponent implements OnInit {

  currentUserApiUrl = '/api/assetReturn/current/pagination';
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('revokeEventRef', { static: true }) revokeEventRef: TemplateRef<any>;
  @ViewChild('table', { static: true }) table: AssetReturningTableComponent;
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
  openRevokeEventDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一项', '重新选择');
    } else {
      this.dialog.open(this.revokeEventRef);
    }
  }
  revokeEvent() {
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
