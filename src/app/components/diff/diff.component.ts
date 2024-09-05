import { DiffEditor } from '@acrodata/code-editor';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-diff',
  standalone: true,
  imports: [DiffEditor],
  templateUrl: './diff.component.html',
  styleUrl: './diff.component.css'
})
export class DiffComponent {
  @Input() userCode = '';
  @Output() userCodeChange = new EventEmitter<string>();
  @Input() commentedResponse = '';
  @Output() commentedResponseChange = new EventEmitter<string>();
  solutionAreaHeight: any = '200px';

  userCodeCodeEditor: string = '';
  commentedResponseCodeEditor: string = '';

  ngOnInit() {
    this.setTxtAreasHeight();
  }
  ngAfterViewInit() {
    this.setTxtAreasHeight;
  }

  ngOnChanges(changes: any) {
    this.userCodeCodeEditor = this.userCode;
    this.commentedResponseCodeEditor = this.commentedResponse;
  }

  solutionInputChange() {
    this.userCode = this.userCodeCodeEditor;
    this.userCodeChange.emit(this.userCode);
  }

  descriptionInputChange() {
    this.commentedResponse = this.commentedResponseCodeEditor;
    this.commentedResponseChange.emit(this.commentedResponse);
  }

  setTxtAreasHeight() {
    let getScreenHeight = window.innerHeight;
    this.solutionAreaHeight = `${(getScreenHeight/2) - 45}px`;
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setTxtAreasHeight();
  }
}
