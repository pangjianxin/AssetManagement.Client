import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';
import { SignalrMessage } from 'src/app/models/dtos/signalr-message';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { AccountService } from './account.service';
// see https://damienbod.com/2017/12/05/sending-direct-messages-using-signalr-with-asp-net-core-and-angular/
@Injectable({
  providedIn: 'root'
})
export class SignalRMessageService {
  messagesReceived$: ReplaySubject<SignalrMessage> = new ReplaySubject<SignalrMessage>(1000, 600_000);
  messagesSent$: ReplaySubject<SignalrMessage> = new ReplaySubject<SignalrMessage>(1000, 600_000);
  orgLogin$: BehaviorSubject<{ orgIdentifier: string, orgName: string, hasMessageUnRead: boolean }>
    = new BehaviorSubject<{ orgIdentifier: string, orgName: string, hasMessageUnRead: boolean }>(null);
  orgLogOut$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  chatConnectionEstablished$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private chatConnection: HubConnection;
  constructor(private jwtHelper: JwtHelperService,
    private alert: AlertService,
    private accountService: AccountService) {
    this.accountService.isAuthenticated$.subscribe(value => {
      if (value) {
        this.registerConnectionOnServerChat();
        this.startChatConnect();
      } else {
        this.chatDisConnect();
      }
    });
  }
  /** 注册远程连接 */
  private registerConnectionOnServerChat() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.host_base_url}/chat`, { accessTokenFactory: this.jwtHelper.tokenGetter })
      .build();
    // 监听服务端的消息发送
    this.chatConnection.on('receiveMessage', (message: SignalrMessage) => {
      this.messagesReceived$.next(message);
    });
    // 监听服务端新用户登录
    this.chatConnection.on('orgLogin', (login: { orgIdentifier: string, orgName: string, hasMessageUnRead: boolean }) => {
      this.orgLogin$.next(login);
    });
    // 当用户登出时发送通知
    this.chatConnection.on('orgLogOut', (logOut: string) => this.orgLogOut$.next(logOut));
  }
  /**开始远程连接 */
  private async startChatConnect() {
    await this.chatConnection.start().then(() => { this.chatConnectionEstablished$.next(true); });
  }
  /**当客户端登录时的逻辑 */
  public async onClientLoginOrRefresh() {
    this.registerConnectionOnServerChat();
    this.startChatConnect();
  }
  /**发送消息 */
  public async chat(targetIdentifier: string, message: string) {
    this.messagesSent$.next({ principal: '你', target: targetIdentifier, timeStamp: new Date().getTime(), message: message, flag: true });
    this.chatConnection.invoke('chat', targetIdentifier, message).catch(error => {
      const afterSeconds = 1;
      this.alert.warn(`与远端的连接已断开,正在重新连接(${afterSeconds}后)......`);
      setTimeout(async () => {
        this.registerConnectionOnServerChat();
        await this.startChatConnect();
      }, afterSeconds);
    });
  }
  public getAllOnlineOrgs() {
    if (this.isChatConnectionEstablished()) {
      this.chatConnection.invoke('allOnLineOrgs')
        .then((result: { orgIdentifier: string, orgName: string, hasMessageUnRead: boolean }[]) => {
          if (result && result.length > 0) {
            result.forEach(item => {
              this.orgLogin$.next(item);
            });
          }
        });
    } else {
    }
  }
  /**判断连接是否建立 */
  private isChatConnectionEstablished() {
    return this.chatConnection && this.chatConnection.state === HubConnectionState.Connected;
  }
  /**
   * 关闭连接
   */
  async  chatDisConnect() {
    if (this.isChatConnectionEstablished()) {
      await this.chatConnection.stop();
      this.chatConnectionEstablished$.next(false);
    }
  }
}
