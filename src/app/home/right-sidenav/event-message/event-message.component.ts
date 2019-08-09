import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from 'src/app/core/services/account.service';
import { SignalREventMessageService } from 'src/app/core/services/signal-revent-message.service';
import { Observable, of } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
@Component({
  selector: 'app-event-message',
  templateUrl: './event-message.component.html',
  styleUrls: ['./event-message.component.scss']
})
export class EventMessageComponent implements OnInit {
  messageList: { principal: string, time: string, message: string }[] = [];
  constructor(public messageService: SignalREventMessageService,
    private accountService: AccountService,
    private alert: AlertService) { }

  ngOnInit() {
    this.accountService.isAuthenticated.subscribe(value => {
      if (value) {
        if (!this.messageService.isConnected) {
          this.messageService.connect()
            .then(() => this.alert.success('SignalR connection established'))
            .catch(error => this.alert.warn(`SignalR connection error:${error}`));
        }
      } else {
        this.messageService.disConnect()
          .then(() => this.alert.success('SignalR disconnected'))
          .catch(error => this.alert.warn(`SignalR disconnect error:${error}`));
      }
    });
  }
  deleteEventMessage(index: number) {
    this.messageService.deleteMessage(index);
  }
}
