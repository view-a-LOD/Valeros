import type { estypes } from '@elastic/elasticsearch';

import { FilterOptionModel } from '../../../models/filters/filter-option.model';
import { FilterModel } from '../../../models/filters/filter.model';

export interface FilterOptionsRequest {
  query: string;
  options: FilterOptionModel[];
  activeFilters: FilterModel[];
}

export interface FilterOptionsProviderResponse {
  responses: estypes.SearchResponse<any>[];
}

export abstract class FilterOptionsProvider {
  abstract getFilterOptions(
    request: FilterOptionsRequest,
  ): Promise<FilterOptionsProviderResponse>;
}
