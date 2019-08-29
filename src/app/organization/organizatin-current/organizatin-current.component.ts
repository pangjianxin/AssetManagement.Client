import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Organization } from 'src/app/models/organization';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-organizatin-current',
  templateUrl: './organizatin-current.component.html',
  styleUrls: ['./organizatin-current.component.scss']
})
export class OrganizatinCurrentComponent implements OnInit {

  tableUrl = `/api/auth/accounts`;
  currentSelection = new SelectionModel<Organization>(true, []);
  searchInput: string;
  currentSelectedOrg: Organization;
  @ViewChild('orgTableFilterInput', { static: true }) orgTableFilterInput: ElementRef;
  constructor() { }

  ngOnInit() {
    fromEvent(this.orgTableFilterInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.searchInput = filter;
      });
  }
  isOneSelected() {
    return this.currentSelection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Organization>) {
    this.currentSelection = $event;
  }
}
