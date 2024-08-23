import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { TermialComponent } from '../termial/termial.component';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OpenAiAssistantService } from '../../services/open-ai-assistant.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [InputComponent, TermialComponent, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit{
  wantRate: boolean = false;
  statusEnum: any = {
    0: 'Loading...',
    1: 'Stand by',
    2: 'Success Response',
    3: 'Error !',
    4: 'Explaing',
    5: 'Comment the code',
    6: 'Rating',
  };
  selectedLanguage = 'english';
  language = 'unknown';

  
  status: number = 0;

  description: string = '';
  solution: string = '';
  explanation: string = '';
  reasonRate: string = '';
  rate: number = 0;

  commentedResponse: any = '';
  rateResponse: any = '';

  dialog = inject(MatDialog);
  assistantSrv = inject(OpenAiAssistantService);

  onClose = () => {};
  onError = () => {
    this.status = 3;
  };
  onOpen = () => {
    this.status = 1;
  };

  onMessage = (message: any) => {
    const res = JSON.parse(message.data);
    if (res.running) {
      switch (this.status) {
        case 4:
          this.explanation += res.text;
          break;
        case 5:
          this.commentedResponse += res.text;
          break;
        case 6:
          this.rateResponse += res.text;
          break;
      }
      
    } else {
      switch (this.status) {
        case 4:
          this.getCommentedCode();
          break;
        case 5:
          let res = JSON.parse(this.commentedResponse);
          this.commentedResponse = res.code;
          this.language = res.language;
          if (this.wantRate) {
            this.getRate();
          } else {
            this.status = 2;
          }
          break;
        case 6:
          let resRate = JSON.parse(this.rateResponse);
          this.rate = resRate.rate;
          this.reasonRate = resRate.reason;
          this.status = 2;
          break;
      }
    }
  };

  ngOnInit() {
    this.assistantSrv.open(
      this.onClose,
      this.onError,
      this.onOpen,
      this.onMessage
    );
  }

  startProcess() {
    this.status = 0;
    this.getExaplanation();
  }

  sendMessage(message: string, type: string = '') {
    try {
      this.assistantSrv.sendMessage(message, type , this.selectedLanguage);
    } catch (error) {
      this.onError();
    }
  }

  getExaplanation() {
    this.status = 4;
    const message = "Help me to explain this code solution, giving this description: ```"+this.description+" ```    \n AND SOLUTION ```"+this.solution+" ```";
    this.sendMessage(message);
  }

  getCommentedCode() {
    this.status = 5;
    const message = `Comment my code with that explanations and return my own code with the comments. Please return the original code as well as old_code`;
    this.sendMessage(message, "comment" );
  }

  getRate() {
    this.status = 6;
    const message = `From  1 to 10 rate my solution, according with the description, just reply the number.`;
    this.sendMessage(message, "rate");
  }

  resetConection() {
    this.assistantSrv.close();
    this.description = '';
    this.solution = '';
    this.explanation = '';
    this.assistantSrv.open(
      this.onClose,
      this.onError,
      this.onOpen,
      this.onMessage
    );
  }
  showMeWhy() {
    this.dialog.open(DialogComponent, {
      data: {message: this.reasonRate},
    });
  }
}
