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
  @Input() userSolution = '';
  @Output() userSolutionChange = new EventEmitter<string>();
  @Input() commentedSolution = '';
  @Output() commentedSolutionChange = new EventEmitter<string>();
  solutionAreaHeight: any = '200px';

  userSolutionCodeEditor: string = '';
  commentedSolutionCodeEditor: string = '';

  ngOnInit() {
    this.setTxtAreasHeight();
  }
  ngAfterViewInit() {
    this.setTxtAreasHeight;
  }

  ngOnChanges(changes: any) {
    console.log(this.userSolution, this.commentedSolution)
    this.userSolutionCodeEditor = this.userSolution;
    this.commentedSolutionCodeEditor = this.commentedSolution;
  }

  solutionInputChange() {
    this.userSolution = this.userSolutionCodeEditor;
    this.userSolutionChange.emit(this.userSolution);
  }

  descriptionInputChange() {
    this.commentedSolution = this.commentedSolutionCodeEditor;
    this.commentedSolutionChange.emit(this.commentedSolution);
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
