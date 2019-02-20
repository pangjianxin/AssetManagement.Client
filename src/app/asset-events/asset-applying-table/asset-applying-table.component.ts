import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, filter } from 'rxjs/operators';
import { AssetApplyingEvent } from 'src/app/models/asset-applying-event';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';

@Component({
  selector: 'app-asset-applying-table',
  templateUrl: './asset-applying-table.component.html',
  styleUrls: ['./asset-applying-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetApplyingTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator') paginator: MatPaginator;
  // 当前分页的基础url
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  // 当前标题
  @Input() title = 'template';
  // 当前副标题
  @Input() subTitle = 'subtemplate';
  @Output() selected = new EventEmitter<SelectionModel<AssetApplyingEvent>>();
  // 表格数据源
  assetApplyingDataSource: MatTableDataSource<AssetApplyingEvent> = new MatTableDataSource<AssetApplyingEvent>();
  // 总数
  totalAssetApplyingCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'status',
    'requestOrgIdentifier', 'requestOrgNam', 'org2', 'targetOrgIdentifier',
    'targetOrgNam', 'message', 'assetCategoryThirdLevel'];
  // 当前选择的记录行
  selection: SelectionModel<AssetApplyingEvent> = new SelectionModel<AssetApplyingEvent>(true, []);
  constructor(private assetApplyingService: AssetApplyingService) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetApplyingPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.initPage();
    this.assetApplyingService.dataSourceChangedSubject.asObservable().pipe(filter(value => value === true)).subscribe(value => {
      this.initPage();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['currentFileterData'].firstChange) {
      this.initPage();
    }
  }
  // 初始化表格
  private initTableParameters() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.assetApplyingDataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.assetApplyingDataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  getAssetApplyingPagination() {
    let targetUrl = `${this.apiUrl}?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    if (this.currentSort.direction) {
      switch (this.currentSort.direction) {
        case 'asc': targetUrl = `${targetUrl}&sorts=${this.currentSort.active}`;
          break;
        case 'desc': targetUrl = `${targetUrl}&sorts=-${this.currentSort.active}`;
          break;
        default:
          break;
      }
    }
    if (this.currentFileterData) {
      targetUrl = `${targetUrl}&filters=AssetApplyingEventsFilter==${this.currentFileterData}`;
    }
    this.assetApplyingService.getPagination(targetUrl).subscribe(response => {
      this.totalAssetApplyingCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetApplyingDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
}