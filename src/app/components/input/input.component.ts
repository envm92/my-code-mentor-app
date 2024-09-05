import { CodeEditor } from '@acrodata/code-editor';
import { Component, EventEmitter, HostListener, Input, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, CodeEditor],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {

  @Input() description = '';
  @Output() descriptionChange = new EventEmitter<string>();
  @Input() solution = '';
  @Output() solutionChange = new EventEmitter<string>();
  solutionAreaHeight: any = '200px';

  solutionCodeEditor: string = '';
  descriptionCodeEditor: string = '';

  ngOnInit() {
    this.setTxtAreasHeight();
  }

  ngOnChanges(changes: any) {
    if (this.description == '' ) {
      this.descriptionCodeEditor = this.description;
    }
    if (this.solution == '' ) {
      this.solutionCodeEditor = this.solution;
    }
  }

  solutionInputChange() {
    this.solution = this.solutionCodeEditor;
    this.solutionChange.emit(this.solution);
  }

  descriptionInputChange() {
    this.description = this.descriptionCodeEditor;
    this.descriptionChange.emit(this.description);
  }

  ngAfterViewInit() {
    this.setTxtAreasHeight;
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
