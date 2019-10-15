import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetInventoryRegister } from 'src/app/models/dtos/asset-inventory-register';
import { AssetInventoryService } from '../../services/asset-inventory-service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-asset-inventory-register-table',
  templateUrl: './asset-inventory-register-table.component.html',
  styleUrls: ['./asset-inventory-register-table.component.scss']
})
export class AssetInventoryRegisterTableComponent implements OnInit, OnChanges {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() apiUrl: string;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Output() selected = new EventEmitter<SelectionModel<AssetInventoryRegister>>();
  dataSource: MatTableDataSource<AssetInventoryRegister> = new MatTableDataSource<AssetInventoryRegister>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['select', 'orgIdentifier', 'orgNam', 'org2', 'assetStockTakingName',
    'assetStockTakingDescription', 'progress'];
  // 当前选择的记录行
  selection: SelectionModel<AssetInventoryRegister> = new SelectionModel<AssetInventoryRegister>(true, []);
  constructor(private stockTakingService: AssetInventoryService) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetStockTakingOrgPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.initPage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (!changes['currentFileterData'].firstChange) {
    //   this.initPage();
    // }
  }
  // 初始化表格
  private initTableParameters() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: 0
    },
      this.currentSort = {
        active: '',
        direction: ''
      };
  }
  /** 判断是否已经选择了所有行 */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** 选择所有行，如果已经选择了所有行，那么就反选 */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  private getAssetStockTakingOrgPagination() {
    let targetUrl = `${this.apiUrl}&page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
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
      targetUrl = `${targetUrl}&filters=AssetsFilter==${this.currentFileterData}`;
    }
    this.stockTakingService.secondaryInventoryRegisters(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      console.log(response.body.data);
      this.dataSource.data = response.body.data;
      this.selection.clear();
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }

}
