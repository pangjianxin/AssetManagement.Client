export class SignalrMessage {
    principal: string;
    target: string;
    timeStamp: number;
    message: string;
    /*标记该条消息是发出的还是收入的*/
    flag = false;
}
