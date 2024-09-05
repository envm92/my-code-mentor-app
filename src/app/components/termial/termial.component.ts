import { Component, Input } from '@angular/core';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'app-termial',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './termial.component.html',
  styleUrl: './termial.component.css'
})
export class TermialComponent {
  @Input() explanation = '';
  data:any = '';

  constructor(private mdService:MarkdownService) {}

  ngOnChanges(changes: any) {
    this.data = this.mdService.parse(this.explanation);
  }
}
