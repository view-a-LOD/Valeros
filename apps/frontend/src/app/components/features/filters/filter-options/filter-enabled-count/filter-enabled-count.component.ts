import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterType } from '../../../../../models/filters/filter.model';

@Component({
  selector: 'app-filter-enabled-count',
  imports: [TranslatePipe],
  templateUrl: './filter-enabled-count.component.html',
  styleUrl: './filter-enabled-count.component.scss',
})
export class FilterEnabledCountComponent {
  @Input() count?: number;
  protected readonly FilterType = FilterType;
}
