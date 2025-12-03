import { Injectable } from '@angular/core';

import { Settings } from '../../../config/settings';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../../../models/autocomplete-option.model';
import { ElasticEndpointSearchResponse } from '../../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticShouldQueries } from '../../../models/elastic/elastic-should-queries.type';
import { FilterOptionsIdsModel } from '../../../models/filters/filter-option.model';
import { FilterModel } from '../../../models/filters/filter.model';
import { DataService } from '../../data.service';
import { ElasticService } from '../search-providers/elastic-search-provider/elastic.service';
import {
  AutocompleteProvider,
  AutocompleteRequest,
  AutocompleteResponse,
} from './autocomplete-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class ElasticAutocompleteProvider extends AutocompleteProvider {
  constructor(
    private elastic: ElasticService,
    private data: DataService,
  ) {
    super();
  }

  private _getOptionsFromSearchResults(
    results: ElasticEndpointSearchResponse<any>[],
  ): { [id: string]: Set<string> } {
    const optionsSet: { [id: string]: Set<string> } = {};

    for (const result of results) {
      for (const hit of result.hits.hits) {
        const hitNode = hit._source;
        const id = hitNode['@id'] as string;

        if (!(id in optionsSet)) {
          optionsSet[id] = new Set<string>();
        }

        Settings.predicates.label.forEach((predicate) => {
          const elasticLabelPredicate =
            this.data.replacePeriodsWithSpaces(predicate);
          if (elasticLabelPredicate in hitNode) {
            optionsSet[id].add(hitNode[elasticLabelPredicate]);
          }
        });
      }
    }

    return optionsSet;
  }

  private async _getOptionsFromElastic(
    query: any,
    optionType: AutocompleteOptionType,
  ): Promise<AutocompleteOptionModel[]> {
    console.log('AUTO QUERY', query, optionType);
    const results: ElasticEndpointSearchResponse<any>[] =
      await this.elastic.searchEndpoints(query);

    const optionsSet = this._getOptionsFromSearchResults(results);
    const options: AutocompleteOptionModel[] = Object.keys(optionsSet)
      .map((id) => ({
        '@id': id,
        labels: Array.from(optionsSet[id]),
        type: optionType,
      }))
      .filter((option: AutocompleteOptionModel) => option.labels.length > 0);

    return options;
  }

  async getOptions(
    request: AutocompleteRequest,
  ): Promise<AutocompleteResponse> {
    const searchInput = request.term?.trim();
    if (!searchInput) {
      return { options: [] };
    }

    const filtersForAutocompleteOptions: FilterModel[] =
      this.data.convertFiltersFromIdsFormat(
        Settings.search.autocomplete
          .filtersForAutocompleteOptions as FilterOptionsIdsModel,
      );

    const queriesForAutocompleteOptions: ElasticShouldQueries[] =
      this.elastic.getFieldAndValueFilterQueries(filtersForAutocompleteOptions);

    const baseQuery: any = {
      query: {
        bool: {
          must: [
            {
              query_string: { query: `*${searchInput}*` },
            },
          ],
        },
      },
      size: Settings.search.autocomplete.maxAutocompleteOptionsPerEndpoint,
    };

    const searchTermQuery: any = JSON.parse(JSON.stringify(baseQuery));
    searchTermQuery.query.bool.should = queriesForAutocompleteOptions;
    searchTermQuery.query.bool.minimum_should_match = 1;

    const nodeOptions: AutocompleteOptionModel[] =
      await this._getOptionsFromElastic(baseQuery, AutocompleteOptionType.Node);

    const searchTermOptions: AutocompleteOptionModel[] =
      await this._getOptionsFromElastic(
        searchTermQuery,
        AutocompleteOptionType.SearchTerm,
      );

    const allOptions = [...searchTermOptions, ...nodeOptions];
    const shownOptions = allOptions.slice(
      0,
      Settings.search.autocomplete.maxAutocompleteOptionsToShow,
    );

    console.log('AUTO', allOptions, shownOptions, nodeOptions);
    return { options: shownOptions };
  }
}
