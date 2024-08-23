import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-termial',
  standalone: true,
  imports: [],
  templateUrl: './termial.component.html',
  styleUrl: './termial.component.css'
})
export class TermialComponent {
  @Input() explanation = '';
}
