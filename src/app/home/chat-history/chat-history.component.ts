import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SignalRMessageService } from 'src/app/core/services/signalR-message.service';
import { ChatComponent } from '../chat/chat.component';
import { MatDialog } from '@angular/material';
import { AccountService } from 'src/app/core/services/account.service';
@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit {
  onLineUsers: { orgIdentifier: string, orgName: string, hasMessageUnRead: boolean }[] = [];
  @Input() currentUserIdentifier: string;
  // 对话框是否打开的一个标志
  dialogOpened: boolean;
  constructor(private chatService: SignalRMessageService,
    private dialog: MatDialog,
    private accountService: AccountService
  ) { }
  ngOnInit() {
    this.dialogOpened = false;
    // 监听socket建立连接的事件
    this.chatService.chatConnectionEstablished$.subscribe(value => {
      if (value) {
        this.chatService.getAllOnlineOrgs();
      } else {
        this.onLineUsers = [];
      }
    });
    // 监听socket登录的事件
    this.chatService.orgLogin$.subscribe(value => {
      if (value) {
        if (!this.onLineUsers.some(it => it.orgIdentifier === value.orgIdentifier)) {
          this.onLineUsers.push(value);
        }
      }
    });
    // 监听socket登出事件
    this.chatService.orgLogOut$.subscribe(value => {
      if (value) {
        this.onLineUsers = this.onLineUsers.filter(it => it.orgIdentifier !== value);
      }
    });
    this.chatService.messagesReceived$.subscribe(value => {
      if (value) {
        this.onLineUsers.filter(item => item.orgIdentifier === value.principal).map(that => {
          // 只有在对话框没有打开的情况下才会设置未读消息
          if (!this.dialogOpened) {
            that.hasMessageUnRead = true;
          }
        });
      }
    });
  }
  // 挑选目标机构后，打开聊天对话框，并将聊天对象的字段传送过去
  openChatDialog(orgIdentifier: string) {
    const dialogRef = this.dialog.open(ChatComponent, {
      width: '60%',
      height: '60%',
      data: {
        orgIdentifier
      }
    });
    // 将对话框打开的字段置为true
    this.dialogOpened = true;
    // 对话框关闭后将对话框是否打开状态置为false
    dialogRef.afterClosed().subscribe(value => {
      console.log('close dialog');
      this.dialogOpened = false;
    });
    this.onLineUsers.map(value => {
      if (value.orgIdentifier === orgIdentifier) {
        value.hasMessageUnRead = false;
      }
    });
  }

}
