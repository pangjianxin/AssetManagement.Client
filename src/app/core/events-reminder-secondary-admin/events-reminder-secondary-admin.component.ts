import { Component, OnInit, Input } from '@angular/core';
import { NonauditEvent } from 'src/app/models/nonaudit-event';
import { NonauditEventService } from '../services/nonaudit-event.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetApplyingService } from '../services/asset-applying.service';
import { AssetApplyingEvent } from 'src/app/models/asset-applying-event';
import { AssetReturningEvent } from 'src/app/models/asset-returning-event';
import { AssetReturningService } from '../services/asset-returning.service';

@Component({
  selector: 'app-events-reminder-secondary-admin',
  templateUrl: './events-reminder-secondary-admin.component.html',
  styleUrls: ['./events-reminder-secondary-admin.component.scss']
})
export class EventsReminderSecondaryAdminComponent implements OnInit {
  @Input() panelExpandedStatus = false;
  nonAuditEvents$: Observable<Array<NonauditEvent>>;
  assetApplyingEvents$: Observable<Array<AssetApplyingEvent>>;
  assetReturningEvents$: Observable<Array<AssetReturningEvent>>;
  constructor(private nonAuditEventsService: NonauditEventService,
    private assetApplyService: AssetApplyingService,
    private assetReturnService: AssetReturningService,
    private router: Router) { }
  ngOnInit() {
    this.nonAuditEvents$ = this.nonAuditEventsService.getFirstFiveEventsBySecondaryAdmin().pipe(map(value => value.data));
    this.assetApplyingEvents$ = this.assetApplyService.getFirstFiveBySecondaryAdminAsync().pipe(map(value => value.data));
    this.assetReturningEvents$ = this.assetReturnService.getFirstFiveBySecondaryAdminAsync().pipe(map(value => value.data));
  }

}
