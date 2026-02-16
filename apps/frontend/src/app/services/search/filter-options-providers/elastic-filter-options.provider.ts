import { Injectable } from '@angular/core';

import { ElasticService } from '../search-providers/elastic-search-provider/elastic.service';
import {
  FilterOptionsProvider,
  FilterOptionsProviderResponse,
  FilterOptionsRequest,
} from './filter-options-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class ElasticFilterOptionsProvider extends FilterOptionsProvider {
  constructor(private elastic: ElasticService) {
    super();
  }

  async getFilterOptions(
    request: FilterOptionsRequest,
  ): Promise<FilterOptionsProviderResponse> {
    const responses = await this.elastic.getFilterOptions(
      request.query,
      request.options,
      request.activeFilters,
    );

    return { responses };
  }
}
