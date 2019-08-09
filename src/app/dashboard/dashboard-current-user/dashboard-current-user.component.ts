import { Component, OnInit } from '@angular/core';
import { Organization } from 'src/app/models/organization';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { RequestActionModel } from 'src/app/models/request-action-model';

@Component({
  selector: 'app-dashboard-current-user',
  templateUrl: './dashboard-current-user.component.html',
  styleUrls: ['./dashboard-current-user.component.scss']
})
export class DashboardCurrentUserComponent implements OnInit {
  // chart dataset
  assetCategoryByThirdLevelDataset: Array<{ name: string, value: number }>;
  assetTableUrl: string;
  currentAssetThirdLevel: string;
  currentAssetStatus: string;

  currentDate = new Date();

  constructor(
    private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.assetTableUrl = `/api/dashboard/current/assets/pagination`;
    this.dashboardService.getCurrentAssetCategories().subscribe({
      next: (value: RequestActionModel) => {
        this.assetCategoryByThirdLevelDataset = value.data;
      }
    });
  }
  onThirdLevelEmitted($event) {
    this.currentAssetThirdLevel = $event;
  }
  onStatusEmitted($event) {
    this.currentAssetStatus = $event;
  }
  displayOrg(org: Organization) {
    if (org) {
      return `${org.orgNam}`;
    } else {
      return ``;
    }
  }
}
