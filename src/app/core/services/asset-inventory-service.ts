import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CteateAssetInventory } from 'src/app/models/viewmodels/create-asset-inventory';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { Observable, Subject } from 'rxjs';
import { CreateAssetInventoryDetail } from 'src/app/models/viewmodels/create-asset-inventory-detail';


@Injectable({
  providedIn: 'root'
})
export class AssetInventoryService {
  dataSourceChangedSubject: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  // 创建任务
  createAssetInventory(model: CteateAssetInventory): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/assetStockTaking/secondary/create', JSON.stringify(model));
  }
  // 查看相应年份相应二级行有没有发布过资产盘点任务
  anyInventoryRegister(year: number): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/assetStockTaking/secondary/anystocktaking?year=${year}`);
  }
  // 当前二级行发布的所有资产盘点任务
  secondaryList(year: number): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/assetStockTaking/secondary/list?year=${year}`);
  }
  // 获取资产盘点任务的参与机构
  secondaryInventoryRegisters(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  // 获取当前机构下的未经盘点的资产分页数据
  assetsWithoutInventory(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
  // 查询当前机构在year年份中有没有参与资产盘点的记录
  anyRegisters(year: number): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/assetStockTaking/current/anystocktakingorgs?year=${year}`);
  }
  // 获取所有的资产盘点参与机构（有该机构参与的）
  allInventoryRegisterInYear(year: number): Observable<RequestActionModel> {
    return this.http.get<RequestActionModel>(`/api/assetStockTaking/current/assetstocktakingorgs?year=${year}`);
  }
  createInventoryDetail(model: CreateAssetInventoryDetail): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>(`/api/assetStockTaking/current/createdetail`, JSON.stringify(model));
  }
  currentAssetInventoryDetails(url: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(url, { observe: 'response' });
  }
}
