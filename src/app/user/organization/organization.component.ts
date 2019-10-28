import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Organization } from 'src/app/models/dtos/organization';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  tableUrl: string;
  currentSelection = new SelectionModel<Organization>(true, []);
  searchInput: string;
  currentSelectedOrg: Organization;
  @ViewChild('orgTableFilterInput', { static: true }) orgTableFilterInput: ElementRef;
  constructor() {
    this.tableUrl = environment.apiBaseUrls.odata.organization;
  }

  ngOnInit() {
    fromEvent(this.orgTableFilterInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.searchInput = this.manipulateOdataFilter(filter);
      });
  }
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(orgIdentifier,'${input}') or contains(orgNam,'${input}')`;
    }
    return '';
  }
  isOneSelected() {
    return this.currentSelection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Organization>) {
    this.currentSelection = $event;
  }

}
