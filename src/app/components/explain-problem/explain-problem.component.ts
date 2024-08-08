import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAiAssistantService } from '../../services/open-ai-assistant.service';
import { CommonModule } from '@angular/common';
import { CodeEditor, DiffEditor } from '@acrodata/code-editor';
import "98.css";

@Component({
  selector: 'app-explain-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, CodeEditor, DiffEditor],
  templateUrl: './explain-problem.component.html',
  styleUrl: './explain-problem.component.css',
})
export class ExplainProblemComponent {
  responseOpenAi = '';
  resCommentedCode = '';
  oldCode = '';
  commentedCode = '';
  rateResponse = '';
  language = 'unknown';
  rate = 10;
  threadId = '';
  description = '';
  solution = '';

  public getScreenHeight: any;
  rows = 100;
  solutionAreaHeight: any = '200px';
  statusEnum: any = {
    0: 'Loading...',
    1: 'Stand by',
    2: 'Success Response',
    3: 'Error !',
    4: 'Explaing',
    5: 'Comment the code',
    6: 'Rating'
  };
  status = 0;
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
          this.responseOpenAi += res.text;
          break;
        case 5:
          this.resCommentedCode += res.text;
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
          let res = JSON.parse(this.resCommentedCode);
          this.commentedCode = res.code;
          this.oldCode = res.old_code;
          this.language = res.language;
          this.getRate();
          break;
        case 6:
          let resRate = JSON.parse(this.rateResponse);
          console.log(resRate);
          this.status = 2;
          break;
      }
    }
  };

  ngOnInit() {
    this.setTxtAreasHeight();
    this.assistantSrv.open(
      this.onClose,
      this.onError,
      this.onOpen,
      this.onMessage
    );
  }

  ngAfterViewInit() {
    this.setTxtAreasHeight;
  }

  setTxtAreasHeight() {
    this.getScreenHeight = window.innerHeight;
    this.rows = this.getScreenHeight / 12 - 10;
    this.solutionAreaHeight = `${this.getScreenHeight - 170}px`;
  }

  resetConection() {
    this.assistantSrv.close();
    this.description = '';
    this.solution = '';
    this.responseOpenAi = '';
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

  getExaplanation() {
    this.status = 4;
    const message = "Help me to explain this code solution, giving this description: ```"+this.description+" ```    \n AND SOLUTION ```"+this.solution+" ```";
    this.sendMessage(message);
  }

  getCommentedCode() {
    this.status = 5;
    const message = `Comment my code with that explanations and only return my own code with the comments.`;
    this.sendMessage(message, "comment" );
  }

  getRate() {
    this.status = 6;
    const message = `From  1 to 10 rate my solution, according with the description, just reply the number.`;
    this.sendMessage(message, "rate");
  }

  sendMessage(message: string, type: string = '') {
    try {
      this.assistantSrv.sendMessage(message, type);
    } catch (error) {
      this.onError();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setTxtAreasHeight();
  }
}
