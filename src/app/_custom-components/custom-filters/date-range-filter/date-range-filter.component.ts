import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterService } from '../../../services/search/filter.service';
import { SearchService } from '../../../services/search/search.service';
import { CustomFilterComponent } from '../custom-filter.directive';
import { DateRangeFilterService } from './date-range-filter.service';

@Component({
  selector: 'app-date-range-filter',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './date-range-filter.component.html',
  standalone: true,
})
export class DateRangeFilterComponent
  extends CustomFilterComponent
  implements OnInit
{
  earliestDate?: string;
  latestDate?: string;

  constructor(
    public filters: FilterService,
    public dateRange: DateRangeFilterService,
    public search: SearchService,
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    // TODO: Support multiple date fields
    const dateField = this.fieldIds?.[0] ?? '';
    this.dateRange.initFieldId(dateField);
    this.initEarliestLatestDates();

    // this.filters.enabled.subscribe(() => {});
  }

  async initEarliestLatestDates() {
    try {
      const { earliest, latest } =
        await this.dateRange.getEarliestLatestDates();
      this.earliestDate = earliest;
      this.latestDate = latest;
      // this.fromDate = earliest;
      // this.toDate = latest;

      // const fromDateIsEarlierThanEarliestDate =
      //   this.dateRange.fromDate &&
      //   this.earliestDate &&
      //   this.dateRange.fromDate < this.earliestDate;
      // if (fromDateIsEarlierThanEarliestDate) {
      //   this.dateRange.fromDate = this.earliestDate;
      // }

      // const toDateIsLaterThanLatestDate =
      //   this.dateRange.toDate &&
      //   this.latestDate &&
      //   this.dateRange.toDate > this.latestDate;
      // if (toDateIsLaterThanLatestDate) {
      //   this.dateRange.toDate = this.latestDate;
      // }
    } catch (e) {
      console.error(e);
    }
  }
}
