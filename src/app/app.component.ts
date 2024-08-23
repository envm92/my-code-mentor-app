import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExplainProblemComponent } from './components/explain-problem/explain-problem.component';
import { MainComponent } from "./components/main/main.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ExplainProblemComponent, MainComponent],
  template: '<app-main></app-main>'
})
export class AppComponent {}
