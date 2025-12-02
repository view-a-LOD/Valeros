import { Injectable } from '@angular/core';
import type { estypes } from '@elastic/elasticsearch';
import { CustomFiltersRegistry } from '../../components/custom-components/custom-filters/custom-filters.registry';
import { Settings } from '../../config/settings';
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticFieldExistsQuery } from '../../models/elastic/elastic-field-exists-query.type';
import { ElasticFullTextMatchQuery } from '../../models/elastic/elastic-full-text-match-query.type';
import { ElasticMatchAllQuery } from '../../models/elastic/elastic-match-all-query.type';
import { ElasticMatchQueries } from '../../models/elastic/elastic-match-queries.type';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { ElasticQuery } from '../../models/elastic/elastic-query.type';
import { ElasticShouldQueries } from '../../models/elastic/elastic-should-queries.type';
import { ElasticSortEntryModel } from '../../models/elastic/elastic-sort.model';
import {
  FilterOptionModel,
  FilterOptionsIdsModel,
} from '../../models/filters/filter-option.model';
import { FilterModel, FilterType } from '../../models/filters/filter.model';
import { SortOrder } from '../../models/settings/sort-order.enum';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { EndpointService } from '../endpoint.service';
import { SettingsService } from '../settings.service';
import { SortService } from '../sort.service';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(
    private api: ApiService,
    private data: DataService,
    private settings: SettingsService,
    private endpoints: EndpointService,
    private sort: SortService,
    private customFiltersRegistry: CustomFiltersRegistry,
  ) {}

  private _getSearchQuery(query: string): ElasticQuery {
    return this.getQuery(query);
  }

  private getQuery(
    query?: string,
    field?: string,
    boost?: number,
  ): ElasticQuery {
    if (!query) {
      query = '';
    }

    const elasticQuery: ElasticQuery = {
      query_string: {
        query: query,
        boost: boost,
      },
    };
    if (field) {
      elasticQuery.query_string.fields = [field];
    }
    return elasticQuery;
  }

  private _getFieldExistsQuery(
    fieldId?: string,
    boost?: number,
  ): ElasticFieldExistsQuery {
    if (!fieldId) {
      fieldId = '';
    }
    return {
      exists: {
        field: this.data.replacePeriodsWithSpaces(fieldId),
        boost: boost,
      },
    };
  }

  private _getFieldOrValueFilterQueries(
    filters: FilterModel[],
    boost?: number,
  ): (
    | ElasticFieldExistsQuery
    | ElasticQuery
    | ElasticFullTextMatchQuery
    | ElasticShouldQueries
    | ElasticMatchAllQuery
  )[] {
    const fieldOrValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.Value || filter.type === FilterType.Field,
    );

    return fieldOrValueFilters.map((filter) => {
      if (filter.type === FilterType.Field) {
        return this._getFieldExistsQuery(filter?.fieldId, boost);
      }
      return this.getQuery(filter?.valueId, undefined, boost);
    });
  }

  private _getFullTextMatchQuery(query: string): ElasticFullTextMatchQuery {
    return {
      match: {
        _full_text: {
          query: query,
        },
      },
    };
  }

  private _getCombinedSearchQuery(query: string): ElasticShouldQueries {
    return {
      bool: {
        should: [
          this._getSearchQuery(query),
          this._getFullTextMatchQuery(query),
        ],
      },
    };
  }

  async getFilterOptions(
    query: string,
    filterOptions: FilterOptionModel[],
    activeFilters: FilterModel[],
  ): Promise<estypes.SearchResponse<any>[]> {
    const fieldIds: string[] = filterOptions.flatMap(
      (filterOption) => filterOption.fieldIds,
    );
    const aggs = fieldIds.reduce((result: any, fieldId: string) => {
      const elasticFieldId = this.data.replacePeriodsWithSpaces(fieldId);

      let order = undefined;

      // TODO: Support multiple filter options for the same field, sorted differently
      const filterOption = filterOptions.find((option) =>
        option.fieldIds.includes(fieldId),
      );

      if (filterOption?.sort) {
        order = {
          [filterOption.sort.type]: filterOption.sort.order,
        };
      }

      result[elasticFieldId] = {
        terms: {
          field: elasticFieldId,
          min_doc_count:
            Settings.filtering.minNumOfValuesForFilterOptionToAppear,
          size: Settings.search.elasticFilterTopHitsMax,
          order: order,
        },
      };

      const clusteringIsEnabled =
        Object.keys(Settings.clustering.filterOptionValues).length > 0;
      if (clusteringIsEnabled) {
        // Retrieve hit IDs for each filter option value (e.g. "public domain" for the "license" filter option). We need these so we can check if we need to cluster values.
        // Note that this is quite a big performance hit, especially when working with many filter options/values.
        result[elasticFieldId].aggs = {
          field_hits: {
            top_hits: {
              size: Settings.search.elasticFilterTopHitsMax,
              _source: '',
            },
          },
        };
      }
      return result;
    }, {});

    const queryData = this.getNodeSearchQuery(
      query,
      activeFilters,
      0,
      Settings.search.elasticFilterTopHitsMax,
    );
    queryData.aggs = { ...aggs };
    queryData.size = 0;
    queryData['_source'] = '';

    return await this.searchEndpoints(queryData);
  }

  getFieldAndValueFilterQueries(
    filters: FilterModel[],
    boost?: number,
  ): ElasticShouldQueries[] {
    const fieldAndValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.FieldAndValue &&
        filter.fieldId !== undefined,
    );

    let matchQueries: { [filterId: string]: ElasticShouldQueries[] } = {};
    fieldAndValueFilters.forEach((filter) => {
      if (!filter.fieldId || !filter.valueId) {
        return;
      }
      const fieldIdWithSpaces = this.data.replacePeriodsWithSpaces(
        filter.fieldId,
      );
      const fieldIdWithDots = filter.fieldId;

      const matchQueryWithSpaces: ElasticMatchQueries = {
        match_phrase: {
          [fieldIdWithSpaces]: { query: filter.valueId, boost: boost },
        },
      };

      const matchQueryWithDots: ElasticMatchQueries = {
        match_phrase: {
          [fieldIdWithDots]: { query: filter.valueId, boost: boost },
        },
      };

      const shouldQuery: ElasticShouldQueries = {
        bool: {
          should: [matchQueryWithSpaces, matchQueryWithDots],
        },
      };

      const filterId = filter?.filterId ?? 'Filter';
      if (!(filterId in matchQueries)) {
        matchQueries[filterId] = [];
      }
      matchQueries[filterId].push(shouldQuery);
    });

    const shouldMatchQueries: ElasticShouldQueries[] = Object.values(
      matchQueries,
    ).map((queries) => {
      return { bool: { should: queries } };
    });
    return shouldMatchQueries;
  }

  async searchEndpoints<T>(
    queryData: estypes.SearchRequest,
  ): Promise<ElasticEndpointSearchResponse<T>[]> {
    const searchPromisesAndEndpoints: {
      promise: Promise<estypes.SearchResponse<T>>;
      endpointId: string;
    }[] = [];
    for (const endpoint of this.endpoints.getAllEnabledUrls()) {
      if (!endpoint.elastic) {
        continue;
      }

      const searchPromise: Promise<estypes.SearchResponse<T>> =
        this.api.postData<estypes.SearchResponse<T>>(
          endpoint.elastic,
          queryData,
        );

      searchPromisesAndEndpoints.push({
        promise: searchPromise,
        endpointId: endpoint?.id ?? 'N/A',
      });
    }

    const searchPromises: Promise<estypes.SearchResponse<T>>[] =
      searchPromisesAndEndpoints.map((s) => s.promise);
    const searchResults: estypes.SearchResponse<T>[] =
      await Promise.all(searchPromises);

    const searchResultsWithEndpointIds: ElasticEndpointSearchResponse<T>[] =
      searchResults.map((searchResult, index) => ({
        ...searchResult,
        endpointId: searchPromisesAndEndpoints[index].endpointId,
      }));
    return searchResultsWithEndpointIds;
  }

  private _getElasticSortEntriesFromSortOption(): ElasticSortEntryModel[] {
    const sort = this.sort.current.value;
    if (!sort) {
      return [];
    }

    const elasticSortEntries: ElasticSortEntryModel[] = sort.fields.map(
      (field) => {
        const elasticField = this.data.replacePeriodsWithSpaces(field);
        return {
          [elasticField]: {
            order: sort.order === SortOrder.Ascending ? 'asc' : 'desc',
            unmapped_type: 'keyword',
          },
        };
      },
    );

    return elasticSortEntries;
  }

  getNodeSearchQuery(
    query: string,
    filters: FilterModel[],
    from?: number,
    size?: number,
  ): estypes.SearchRequest {
    if (query === undefined) {
      return {};
    }
    query = query.trim();

    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {},
      },
    };

    // Sorting
    const elasticSortEntries = this._getElasticSortEntriesFromSortOption();
    const shouldSort = elasticSortEntries && elasticSortEntries.length > 0;
    if (shouldSort) {
      queryData.sort = elasticSortEntries;
    }

    // Search filters
    let searchFilters: FilterModel[] = filters;

    const fieldOrValueFilterQueries: (
      | ElasticFieldExistsQuery
      | ElasticQuery
      | ElasticFullTextMatchQuery
      | ElasticShouldQueries
      | ElasticMatchAllQuery
    )[] = this._getFieldOrValueFilterQueries(searchFilters);

    if (query) {
      const combinedQuery = this._getCombinedSearchQuery(query);
      fieldOrValueFilterQueries.push(combinedQuery);
    } else {
      fieldOrValueFilterQueries.push({ match_all: {} });
    }

    const fieldAndValueFilterQueries =
      this.getFieldAndValueFilterQueries(searchFilters);

    const mustQueries: ElasticShouldQueries[] = [...fieldAndValueFilterQueries];
    if (fieldOrValueFilterQueries && fieldOrValueFilterQueries.length > 0) {
      mustQueries.push({ bool: { should: fieldOrValueFilterQueries } });
    }

    // Add custom filter queries
    const customQueries = this.customFiltersRegistry.getAllElasticQueries();
    if (customQueries && customQueries.length > 0) {
      mustQueries.push(...customQueries);
    }

    // Only show filters (e.g., only show "InformatieObject")
    const onlyShowFilters = this.data.convertFiltersFromIdsFormat(
      Settings.nodeVisibility.onlyShow as FilterOptionsIdsModel,
    );
    const onlyShowQueries: ElasticShouldQueries[] =
      this.getFieldAndValueFilterQueries(onlyShowFilters);
    if (onlyShowQueries && onlyShowQueries.length > 0) {
      mustQueries.push(...onlyShowQueries);
    }

    if (mustQueries && mustQueries.length > 0) {
      queryData.query.bool.must = mustQueries;
    }

    // Hiding filters (e.g., hiding terms)
    const hideFilters = this.data.convertFiltersFromIdsFormat(
      Settings.nodeVisibility.alwaysHide as FilterOptionsIdsModel,
    );
    const hideQueries: ElasticShouldQueries[] =
      this.getFieldAndValueFilterQueries(hideFilters);
    if (hideQueries && hideQueries.length > 0) {
      queryData.query.bool.must_not = hideQueries;
    }

    // Boosting filters
    const boostSettings = this.sort.current.value?.boost;
    if (!boostSettings) {
      return queryData;
    }
    let boostQueries: (
      | ElasticQuery
      | ElasticFieldExistsQuery
      | ElasticFullTextMatchQuery
      | ElasticShouldQueries
      | ElasticMatchQueries
      | ElasticMatchAllQuery
    )[] = [];
    for (const [id, boostSetting] of Object.entries(boostSettings)) {
      const boostFilters = this.data.convertFiltersFromIdsFormat({
        [id]: boostSetting.filter,
      });
      const boostFieldOrValueQueries = this._getFieldOrValueFilterQueries(
        boostFilters,
        boostSetting.boost,
      );
      const boostFieldAndValueQueries = this.getFieldAndValueFilterQueries(
        boostFilters,
        boostSetting.boost,
      ).flatMap((f) => f.bool.should);
      boostQueries = [
        ...boostQueries,
        ...boostFieldOrValueQueries,
        ...boostFieldAndValueQueries,
      ];
    }
    if (boostQueries && boostQueries.length > 0) {
      // TODO: Fix issue with less results showing when including boost queries (e.g. empty search)
      queryData.query.bool.should = boostQueries;
    }

    return queryData;
  }

  async searchNodes(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<ElasticEndpointSearchResponse<ElasticNodeModel>[]> {
    const queryData = this.getNodeSearchQuery(query, filters, from, size);

    return await this.searchEndpoints(queryData);
  }
}
