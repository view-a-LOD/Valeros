import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-tip',
  standalone: true,
  templateUrl: './search-tip.component.html',
  styleUrls: ['./search-tip.component.scss'],
})
export class SearchTipComponent {
  @Input() title: string = '';
  @Input() description: string = '';
}
