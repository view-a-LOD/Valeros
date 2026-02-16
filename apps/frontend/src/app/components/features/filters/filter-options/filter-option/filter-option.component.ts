import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../../config/settings';
import { formatNumber } from '../../../../../helpers/util.helper';
import { FilterOptionValueModel } from '../../../../../models/filters/filter-option.model';
import {
  FilterModel,
  FilterType,
} from '../../../../../models/filters/filter.model';
import { FilterService } from '../../../../../services/search/filter.service';
import { SearchService } from '../../../../../services/search/search.service';
import { NodeLinkComponent } from '../../../node/node-link/node-link.component';

@Component({
  selector: 'app-filter-option',
  imports: [NodeLinkComponent, TranslatePipe],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.scss',
})
export class FilterOptionComponent implements OnInit {
  @Input() filterId?: string;
  @Input() fieldIds?: string[];
  @Input() values?: FilterOptionValueModel[];

  numShowing = Settings.ui.filterOptions.numToShowByDefault;

  constructor(
    public filterService: FilterService,
    public search: SearchService,
  ) {}

  ngOnInit() {
    this.initResetNumShowingOnSearchResultsUpdate();
  }

  initResetNumShowingOnSearchResultsUpdate() {
    this.search.results.subscribe(() => {
      this.numShowing = Settings.ui.filterOptions.numToShowByDefault;
    });
  }

  onFilterToggle(valueIds: string[]) {
    if (!valueIds || !this.fieldIds) {
      return;
    }

    const filters: FilterModel[] = this.fieldIds.flatMap((fieldId) => {
      return valueIds.map((valueId) => {
        return {
          filterId: this.filterId,
          fieldId: fieldId,
          valueId: valueId,
          type: FilterType.FieldAndValue,
        };
      });
    });

    this.filterService.toggleMultiple(filters);
  }

  getFilterOptionCountStr(count: number): string {
    // TODO: When using clustering, the count here might be capped by Settings.search.elasticFilterTopHitsMax and not be accurate
    // if (count >= Settings.search.elasticFilterTopHitsMax) {
    //   return ` (${Settings.search.elasticFilterTopHitsMax}+)`;
    // }

    return ` (${formatNumber(count)})`;
  }

  // TODO: Reduce calls if necessary for performance reasons
  get shownValues(): FilterOptionValueModel[] {
    return this.sortedValues.slice(0, this.numShowing);
  }

  // TODO: Reduce calls if necessary for performance reasons
  get sortedValues(): FilterOptionValueModel[] {
    if (!this.values) {
      return [];
    }

    return [...this.values].sort((a, b) => {
      const aIsSelected = this.filterService.has(
        a.ids,
        FilterType.FieldAndValue,
      );
      const bIsSelected = this.filterService.has(
        b.ids,
        FilterType.FieldAndValue,
      );

      if (aIsSelected !== bIsSelected) {
        return bIsSelected ? 1 : -1;
      }

      return (b.filterHitCount || 0) - (a.filterHitCount || 0);
    });
  }

  get hasMoreToShow(): boolean {
    if (!this.values) {
      return false;
    }
    return this.numShowing < this.values.length;
  }

  onShowMoreClicked() {
    const oldNumShowing = this.shownValues.length;
    this.numShowing += Settings.ui.filterOptions.additionalNumToShowOnClick;
    const newNumShowing = this.shownValues.length;

    if (newNumShowing > oldNumShowing) {
      const focusOnNewFilter = () => {
        const filterId: string = this.getFilterId(
          this.shownValues[oldNumShowing],
        );
        const filterLabel: HTMLElement | null = document.querySelector(
          `label[for="${filterId}"]`,
        );
        filterLabel?.focus();
      };

      setTimeout(() => focusOnNewFilter(), 1);
    }
  }

  getFilterId(value: FilterOptionValueModel) {
    return 'filter-' + value.ids[0]?.replaceAll(' ', '-');
  }

  getFilterLabelId(value: FilterOptionValueModel) {
    return 'label-' + this.getFilterId(value);
  }

  protected readonly FilterType = FilterType;
  protected readonly formatNumber = formatNumber;
}
