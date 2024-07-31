import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  ws: any = null;
  responseOpenAi = '';
  threadId = '';
  description = '';
  solution = '';
  responseLinesCount = 0;

  public getScreenHeight: any;
  rows = 100;
  statusEnum: any = {
    0 : 'Loading...',
    1 : 'Stand by',
    2 : 'Success Response', 
    3 : 'Error !'
  };
  status = 0;
  ngOnInit() {
    this.getScreenHeight = window.innerHeight;
    this.rows = (this.getScreenHeight/12) -10;
    this.openWebSocket();
  }

  handleResponse(response:any) {
    return response.ok
      ? response.json().then((data: any) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  }

  resetConection() {
    if(this.ws) {
      this.ws.close();
    }
    this.description = '';
    this.solution = '';
    this.responseOpenAi = '';
    this.responseLinesCount =0;
    this.openWebSocket();
  }
  openWebSocket() {
    if (this.ws) {
      this.ws.onerror = this.ws.onopen = this.ws.onclose = null;
      this.ws.close();
      this.status = 3;
    }

    this.ws = new WebSocket(`ws://localhost:8080/`);
    this.ws.onerror = () =>{
      this.status = 3;
    };
    this.ws.onopen = () => {
      this.status = 1;
    };
    this.ws.onmessage = (message: any) => {
      const res = JSON.parse(message.data);
      if (res.thread_id) {
        this.threadId = res.thread_id;
      } else {
        if (res.running) {
          this.responseOpenAi += res.text;
          if (/\r|\n/.exec(res.text)) {
            this.responseLinesCount++;
          }
        } else {
          this.status = 2;
        }
      }
    };
    this.ws.onclose = () => {
      this.ws = null;
    };
  }
  sendMessage() {
    if (!this.ws) {
      this.status = 3;
      return;
    }
    const runThreadReq = {
      action: 'add_message',
      assistant_id: '${{YOUR_ASSISTANT_ID}}',
      thread_id: this.threadId,
      message: `Help me to explan this code solution, pleas return the same solution with the explanation in comments,giving this description: ${this.description} <--- END DESCRIPTION --> and this is my solution: ${this.solution}`
    }
    this.ws.send(JSON.stringify(runThreadReq));
    this.status = 0;
  }

  @HostListener('window:resize', ['$event'])

  onWindowResize() {
    this.getScreenHeight = window.innerHeight;
    this.rows = (this.getScreenHeight/12) -10;
  }
}
