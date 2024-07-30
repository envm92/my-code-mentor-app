import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-code-mentor-app';
  ws: any = null;
  responseOpenAi = '';
  threadId = '';
  message = '';
  description = '';
  solution = '';

  constructor(private http: HttpClient) {}

  showMessage(message: any) {
    console.log(message);
  }

  handleResponse(response:any) {
    console.log(response);
    return response.ok
      ? response.json().then((data: any) => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  }
  openWebSocket() {
    if (this.ws) {
      this.ws.onerror = this.ws.onopen = this.ws.onclose = null;
      this.ws.close();
    }

    this.ws = new WebSocket(`ws://localhost:8080/`);
    this.ws.onerror = () =>{
      this.showMessage('WebSocket error');
    };
    this.ws.onopen = () => {
      this.showMessage('WebSocket connection established');
    };
    this.ws.onmessage = (message: any) => {
      const res = JSON.parse(message.data);
      if (res.thread_id) {
        this.threadId = res.thread_id;
      } else {
        this.responseOpenAi += res.text;
      }
    };
    this.ws.onclose = () => {
      this.showMessage('WebSocket connection closed');
      this.ws = null;
    };
  }
  sendMessage() {
    if (!this.ws) {
      this.showMessage('No WebSocket connection');
      return;
    }
    const runThreadReq = {
      action: 'add_message',
      assistant_id: 'asst_W96G4YNrgAyBeRWcgA1Lgt0f',
      thread_id: this.threadId,
      message: this.message
    }
    this.ws.send(JSON.stringify(runThreadReq));
  }
}
