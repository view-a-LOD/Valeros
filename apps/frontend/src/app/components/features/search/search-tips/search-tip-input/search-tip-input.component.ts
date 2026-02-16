import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-tip-input',
  standalone: true,
  imports: [],
  templateUrl: './search-tip-input.component.html',
  styleUrls: ['./search-tip-input.component.scss'],
})
export class SearchTipInputComponent {
  @Input() content: string = '';

  constructor(private translate: TranslateService) {}

  get formattedContent(): string {
    return this.content.replace(
      /(AND|OR|NOT)/g,
      '<span class="font-semibold">$1</span>',
    );
  }

  get ariaLabel(): string {
    const exampleText = this.translate.instant('general.example');
    return `${exampleText}: ${this.content}`;
  }
}
