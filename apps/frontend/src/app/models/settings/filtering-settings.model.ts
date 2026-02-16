import { Type } from '@angular/core';
import { FilterOptionsProvider } from '../../services/search/filter-options-providers/filter-options-provider.interface';
import { FilterOptionModel } from '../filters/filter-option.model';

export interface FilteringSettings {
  showFilterPanel: boolean;
  showOrganizationsFilter: boolean;
  minNumOfValuesForFilterOptionToAppear: number;
  filterOptions: Record<string, FilterOptionModel>;
  filterOptionsProvider?: Type<FilterOptionsProvider>;
}
