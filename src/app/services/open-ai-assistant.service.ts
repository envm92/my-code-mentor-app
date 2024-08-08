import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OpenAiAssistantService {
  ws: WebSocket | null = null;
  threadId: string = '';

  constructor() {}

  open(
    onClose: (() => any),
    onError: (() => any),
    onOpen: (() => any),
    onMessage: ((ev: MessageEvent) => any)
  ) : void {
    if (this.ws) {
      this.ws.onerror = this.ws.onopen = this.ws.onclose = null;
      this.ws.close();
    }
    this.ws = new WebSocket(environment.wsUrl);
    this.ws.onclose = onClose;
    this.ws.onerror = onError;
    this.ws.onopen = onOpen;
    this.ws.onmessage = (message: any) => {
      const res = JSON.parse(message.data);
      if (res.thread_id) {
        this.threadId = res.thread_id;
      } else {
        onMessage(message);
      }
    };
  }

  sendMessage(message: string, type: string = '', selectedLanguage: string) : void {
    if (!this.ws) {
      throw new Error('No WS found');
    }
    const runThreadReq = {
      action: 'add_message',
      assistant_id: environment.assistant_id,
      thread_id: this.threadId,
      message: message,
      type: type,
      instructions: `Talk to me on ${selectedLanguage}`
    };
    console.table(runThreadReq);
    this.ws.send(JSON.stringify(runThreadReq));
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
