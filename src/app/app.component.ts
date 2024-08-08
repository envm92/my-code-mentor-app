import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExplainProblemComponent } from './components/explain-problem/explain-problem.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ExplainProblemComponent],
  template: '<app-explain-problem></app-explain-problem>'
})
export class AppComponent {}
