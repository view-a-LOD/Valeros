import { Injectable } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, filter, skip, take } from 'rxjs';
import { Settings } from '../../config/settings';
import { SearchResultsModel } from '../../models/elastic/search-results.model';
import { NodeModel } from '../../models/node.model';
import { SortOptionModel } from '../../models/settings/sort-option.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { DataService } from '../data.service';
import { DetailsService } from '../details.service';
import { EndpointService } from '../endpoint.service';
import { NodeService } from '../node/node.service';
import { SettingsService } from '../settings.service';
import { SortService } from '../sort.service';
import { UiService } from '../ui/ui.service';
import { UrlService } from '../url.service';
import { FilterService } from './filter.service';
import {
  SearchProvider,
  SearchRequest,
  SearchResponse,
} from './search-providers/search-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string | undefined;

  results: BehaviorSubject<SearchResultsModel> =
    new BehaviorSubject<SearchResultsModel>({});
  page: number = 0;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  numberOfHits: number = 0;
  numberOfHitsIsCappedByElastic: boolean = false;

  hasMoreResultsToLoad = true;

  private _searchQueryId = 0;

  constructor(
    private url: UrlService,
    private nodeSearch: SearchProvider,
    private filters: FilterService,
    private data: DataService,
    private endpoints: EndpointService,
    private route: ActivatedRoute,
    private details: DetailsService,
    private nodes: NodeService,
    private sort: SortService,
    private router: Router,
    private ui: UiService,
    private settings: SettingsService,
  ) {
    this.initSearchOnUrlChange();
    this.initSearchOnFilterChange();
    this.initSearchOnEndpointChange();
    this.initSearchOnSortChange();
  }

  private _mergeNodesById(
    nodes: NodeModel[],
    otherNodes: NodeModel[],
  ): NodeModel[] {
    const nodesMap = new Map<string, any>();
    nodes.forEach((node) => {
      nodesMap.set(node['@id'][0].value, node);
    });

    otherNodes.forEach((otherNode) => {
      const id = otherNode['@id'][0].value;
      if (nodesMap.has(id)) {
        Object.assign(nodesMap.get(id), otherNode);
      } else {
        nodes.push(otherNode);
      }
    });
    return nodes;
  }

  initSearchOnFilterChange() {
    this.filters.searchTrigger.subscribe((s) => {
      if (s.clearFilters) {
        console.log('-- Searching without filters to retrieve options');
      } else {
        console.log('-- Searching with re-applied filters');
      }
      void this.execute(true, s.clearFilters);
    });
  }

  initSearchOnEndpointChange() {
    this.endpoints.enabledIds.pipe(skip(1)).subscribe((_) => {
      console.log('Searching because of updated endpoints...');
      void this.execute(true);
    });
  }

  initSearchOnSortChange() {
    this.sort.current
      .pipe(skip(1))
      .subscribe((sortOption: SortOptionModel | undefined) => {
        console.log('Searching because of sort update...', sortOption);
        void this.execute(true);
      });
  }

  private _searchOnUrlChange(queryParams: Params) {
    if (this.url.ignoreQueryParamChange) {
      console.log('Ignoring query param change');
      return;
    }

    const queryStr = queryParams[Settings.url.params.search];

    const queryStrChanged = queryStr !== this.queryStr;
    if (queryStrChanged) {
      this.queryStr = queryStr;
      console.log('Searching because of query string update');
      void this.execute(true);
      return;
    }
  }

  initSearchOnUrlChange() {
    this.route.queryParams
      .pipe(
        filter((params) => Object.keys(params).length > 0),
        take(1),
      )
      .subscribe((queryParams) => {
        const filtersParam: string | undefined =
          queryParams[Settings.url.params.filters];
        if (filtersParam) {
          this.filters.onUpdateFromURLParam(filtersParam);
        }

        setTimeout(() => this._searchOnUrlChange(queryParams));
      });

    this.route.queryParams.pipe(skip(1)).subscribe((queryParams: Params) => {
      setTimeout(() => {
        this._searchOnUrlChange(queryParams);
      });
    });
  }

  clearResults() {
    this.results.next({});
    this.page = 0;
    this.numberOfHits = 0;
    this.numberOfHitsIsCappedByElastic = false;
  }

  async checkHasMoreResultsToLoad() {
    const response = await this.nodeSearch.searchNodes({
      query: this.queryStr ?? '',
      page: this.page,
      pageSize: Settings.search.resultsPerPagePerEndpoint,
      filters: this.filters.enabled.value,
    });

    this.hasMoreResultsToLoad = !!response.nodes && response.nodes.length > 0;
  }

  async execute(clearResults = false, clearFilters = true) {
    // if (this.queryStr === '') {
    //   return;
    // }

    // this.ui.collapseAllAccordions();

    this._searchQueryId++;

    console.log(
      `Searching for: ${this.queryStr}. Clearing results: ${clearResults}, clearing filters: ${clearFilters}`,
    );
    if (clearResults) {
      this.clearResults();
    }
    if (clearFilters) {
      // Filters are cleared for "initial" search to see what filter options exist for this search term
      //  Afterward, previously existing filters are re-applied if they are still applicable for this search term
      this.filters.clearEnabled();
    }

    this.isLoading.next(true);
    try {
      const searchQueryIdOfRequest = this._searchQueryId;

      const request: SearchRequest = {
        query: this.queryStr ?? '',
        page: this.page,
        pageSize: Settings.search.resultsPerPagePerEndpoint,
        filters: this.filters.enabled.value,
      };

      const response: SearchResponse =
        await this.nodeSearch.searchNodes(request);

      // TODO: Cancel requests if we know there's a new request already (note: cancelling promises not easily supported at the moment)
      const responsesAreOutdated =
        this._searchQueryId !== searchQueryIdOfRequest;
      if (responsesAreOutdated) {
        return;
      }

      this.numberOfHits = response.total;
      this.numberOfHitsIsCappedByElastic = response.isCapped;

      let nodes = response.nodes ?? [];

      const shouldEnrichWithIncomingRelations =
        this.settings.hasViewModeSetting(
          ViewModeSetting.EnrichWithIncomingRelations,
        );

      if (shouldEnrichWithIncomingRelations && nodes.length > 0) {
        // TODO: Run async, show initial hits in the meanwhile
        nodes = await this.nodes.enrichWithIncomingRelations(nodes);
      }

      if (!nodes || nodes.length === 0) {
        this.results.next({
          nodes: [],
        });
      } else {
        const mergedNodes = this._mergeNodesById(
          this.results.value.nodes ?? [],
          nodes,
        );

        this.results.next({
          nodes: mergedNodes,
        });
      }

      // Increment page if we there are results
      if (response.nodes && response.nodes.length > 0) {
        this.page++;
      }

      // Update filter options
      await this.filters.updateFilterOptionValues(this.queryStr ?? '');
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);

      void this.checkHasMoreResultsToLoad();
    }
  }
}
