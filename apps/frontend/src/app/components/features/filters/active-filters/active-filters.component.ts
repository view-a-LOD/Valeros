import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { featherFilter, featherX } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterType } from '../../../../models/filters/filter.model';
import { FilterService } from '../../../../services/search/filter.service';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';

@Component({
  selector: 'app-active-filters',
  standalone: true,
  imports: [NodeLinkComponent, FormsModule, TranslatePipe],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
})
export class ActiveFiltersComponent {
  isShown: boolean = false;

  constructor(public filters: FilterService) {}

  protected readonly featherX = featherX;
  protected readonly featherFilter = featherFilter;
  protected readonly FilterType = FilterType;
}
