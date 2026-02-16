import { Component, HostListener, type OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherFilter } from '@ng-icons/feather-icons';
import { FilterType } from '../../../../../models/filters/filter.model';
import { BreakpointService } from '../../../../../services/breakpoint.service';
import { FilterService } from '../../../../../services/search/filter.service';
import { FilterDrawerService } from '../../../../../services/ui/filter-drawer.service';

@Component({
  selector: '[app-filter-button]',
  imports: [NgIcon],
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent implements OnInit {
  constructor(
    private filters: FilterService,
    public filterDrawer: FilterDrawerService,
    private breakpoint: BreakpointService,
  ) {}

  ngOnInit() {}

  // TODO: Reduce calls if needed for performance reasons
  getNumberOfEnabledFilterOptions(): number {
    const filterIds = Object.keys(this.filters.options.value);
    return filterIds.reduce(
      (enabledFiltersCount, filterId) =>
        enabledFiltersCount +
        this.filters.getOptionEnabledFiltersCount(
          filterId,
          FilterType.FieldAndValue,
        ),
      0,
    );
  }

  @HostListener('click')
  onClick() {
    if (this.breakpoint.isBreakpointOrLarger('lg')) {
      this.filterDrawer.toggleFilterDrawerDesktop();
    } else {
      this.filterDrawer.toggleFilterDrawerMobile();
    }
  }

  protected readonly featherFilter = featherFilter;
}
