import { Injectable } from '@angular/core';

import { estypes } from '@elastic/elasticsearch';
import { Settings } from '../../../config/settings';
import { FilterOptionModel } from '../../../models/filters/filter-option.model';
import { FilterModel } from '../../../models/filters/filter.model';
import { DataService } from '../../data.service';
import { SparqlService } from '../../sparql.service';
import {
  FilterOptionsProvider,
  FilterOptionsProviderResponse,
  FilterOptionsRequest,
} from './filter-options-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class SPARQLFilterOptionsProvider extends FilterOptionsProvider {
  constructor(
    private sparql: SparqlService,
    private data: DataService,
  ) {
    super();
  }

  // TODO: Take into account search query + other activated filters
  async getFilterOptions(
    request: FilterOptionsRequest,
  ): Promise<FilterOptionsProviderResponse> {
    const options: FilterOptionModel[] = request.options;
    const _filters: FilterModel[] = request.activeFilters;

    const minCount = Settings.filtering.minNumOfValuesForFilterOptionToAppear;
    const size = Settings.search.elasticFilterTopHitsMax;

    const aggregations: Record<
      string,
      { buckets: { key: string; doc_count: number }[] }
    > = {};

    for (const option of options) {
      for (const fieldId of option.fieldIds) {
        const fieldIri = `<${fieldId}>`;
        const template = `?s ${fieldIri} ?value .`;
        const federatedPattern = this.sparql.getFederatedQuery(template);

        const query = `
SELECT ?value (COUNT(?s) AS ?count) WHERE {
  ${federatedPattern}
}
GROUP BY ?value
HAVING (COUNT(?s) >= ${minCount})
ORDER BY DESC(?count)
LIMIT ${size}`;

        type Row = { value: string; count: string };
        let rows: Row[] = [];
        try {
          // console.log(query);
          rows = await this.sparql.executeRawQuery<Row[]>(query);
        } catch (error) {
          console.warn('SPARQLFilterOptionsProvider.getFilterOptions error', {
            fieldId,
            error,
          });
          continue;
        }

        const elasticFieldId = this.data.replacePeriodsWithSpaces(fieldId);
        const buckets = rows.map((r) => ({
          key: r.value,
          doc_count: Number(r.count) || 0,
        }));

        aggregations[elasticFieldId] = { buckets };
      }
    }

    const response: estypes.SearchResponse<any> = {
      took: 0,
      timed_out: false,
      _shards: {
        total: 0,
        successful: 0,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: { value: 0, relation: 'eq' },
        max_score: 0,
        hits: [],
      },
      aggregations: aggregations as any,
    };

    // console.log('SPARQLFilterOptionsProvider.getFilterOptions', response);
    return { responses: [response] };
  }
}
