import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class SignalREventMessageService {
  public messageList: { principal: string, time: string, message: string }[] = [];
  private connection: HubConnection;
  constructor(private jwtHelper: JwtHelperService,
    private alert: AlertService) { }
  async connect() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.host_base_url}/eventMessage`, { accessTokenFactory: this.jwtHelper.tokenGetter })
      .build();
    this.connection.on('notify', (principal: string, time: string, message: string) => {
      this.messageList.push({ principal, time, message });
    });
    await this.connection.start();
  }
  async disConnect() {
    await this.connection.stop();
  }
  deleteMessage(index: number) {
    if (index > -1) {
      this.messageList.splice(index, 1);
    }
  }
  get isConnected(): boolean {
    if (!this.connection) {
      return false;
    }
    return this.connection.state === <HubConnectionState>1;
  }
}
