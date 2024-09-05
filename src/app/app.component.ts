import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainComponent } from "./components/main/main.component";
import "98.css";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MainComponent],
  template: '<app-main></app-main>'
})
export class AppComponent {}
