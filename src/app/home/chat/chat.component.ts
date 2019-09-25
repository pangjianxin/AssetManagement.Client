import { Component, OnInit, Inject } from '@angular/core';
import { SignalRMessageService } from 'src/app/core/services/signalR-message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SignalrMessage } from 'src/app/models/dtos/signalr-message';
import { map, filter, merge } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatContent: SignalrMessage[] = [];
  chatContentForm: FormGroup;
  constructor(public chatService: SignalRMessageService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.chatContentForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(99)]]
    });
    this.chatService.messagesSent$.asObservable()
      .pipe(merge(this.chatService.messagesReceived$.asObservable()))
      // 因为这里将发送的消息和接收的消息统一合并到一个管道上了，所以，每一个对话框都应该将发送者为data.orgIdentifier和接收者
      // 为data.orgIdentifier的消息全部收集进来。
      .pipe(filter(value => value.principal === this.data.orgIdentifier || value.target === this.data.orgIdentifier))
      .subscribe(value => {
        console.log(value);
        this.chatContent.push(value);
      });
  }
  async sendMessage() {
    const target = this.data.orgIdentifier;
    const message = this.chatContentForm.get('message').value;
    await this.chatService.chat(target, message).then(it => this.chatContentForm.setValue({ message: '' }));
  }
}
