import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { featherChevronDown } from '@ng-icons/feather-icons';
import { Settings } from '../../../../config/settings';
import { FilterService } from '../../../../services/search/filter.service';
import { SortService } from '../../../../services/sort.service';
import { UiService } from '../../../../services/ui/ui.service';

@Component({
  selector: 'app-sort-select',
  imports: [FormsModule],
  templateUrl: './sort-select.component.html',
  styleUrl: './sort-select.component.scss',
})
export class SortSelectComponent {
  constructor(
    public sorting: SortService,
    public filters: FilterService,
    public ui: UiService,
  ) {}

  onChange(event: any) {
    const selectedId: string = event.target.value;
    this.sorting.select(selectedId);
  }

  protected readonly featherChevronDown = featherChevronDown;
  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
