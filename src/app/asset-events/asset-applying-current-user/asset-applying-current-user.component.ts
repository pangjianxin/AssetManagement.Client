import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, distinctUntilChanged } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApplyingEvent } from 'src/app/models/asset-applying-event';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestActionModel } from 'src/app/models/request-action-model';

@Component({
  selector: 'app-asset-applying-current-user',
  templateUrl: './asset-applying-current-user.component.html',
  styleUrls: ['./asset-applying-current-user.component.scss']
})
export class AssetApplyingCurrentUserComponent implements OnInit {
  assetApplyingCurrnetUserUrl = '/api/assetApply/current/pagination';
  searchInputContent: string;
  selection: SelectionModel<AssetApplyingEvent> = new SelectionModel<AssetApplyingEvent>(true, []);
  currentSelectedRow: AssetApplyingEvent;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('removeEventRef', { static: true }) removeEventRef: TemplateRef<any>;
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
  openRemoveApplicationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一个选项进行操作');
    } else {
      this.currentSelectedRow = this.selection.selected[0];
      this.dialog.open(this.removeEventRef);
    }
  }
  removeApplication() {
    this.assetApplyingService.remove(this.currentSelectedRow.eventId).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetApplyingService.dataSourceChangedSubject.next(true);
      },
      error: (value: RequestActionModel) => this.alert.failure(value.message)
    });
  }

}
