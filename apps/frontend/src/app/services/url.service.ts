import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
import { CustomFiltersRegistry } from '../_custom-components/custom-filters/custom-filters.registry';
import { Settings } from '../config/settings';
import { FilterOptionsIdsModel } from '../models/filters/filter-option.model';
import { FilterQueryParams } from '../models/filters/filter-query-params.model';
import { FilterModel } from '../models/filters/filter.model';
import { SuraResponse } from '../models/sura-response.model';
import { ApiService } from './api.service';
import { DataService } from './data.service';
import { DetailsService } from './details.service';
import { EndpointService } from './endpoint.service';
import { FilterService } from './search/filter.service';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  ignoreQueryParamChange = false;

  constructor(
    private details: DetailsService,
    private filters: FilterService,
    private router: Router,
    private data: DataService,
    private endpoints: EndpointService,
    private api: ApiService,
    private customFiltersRegistry: CustomFiltersRegistry,
  ) {
    this._initUpdateUrlOnFilterChange();
    this._initUpdateUrlOnEndpointChange();
  }

  private _initUpdateUrlOnFilterChange() {
    // Skip URL change for initial (empty) enabled filters, as well as filters loaded from URL
    this.filters.enabled.pipe(skip(2)).subscribe((enabledFilters) => {
      void this.updateUrlToReflectFilters(enabledFilters);
    });
  }

  private _initUpdateUrlOnEndpointChange() {
    this.endpoints.enabledIds
      .pipe(skip(1))
      .subscribe((endpointIds: string[]) => {
        void this._updateUrlToReflectEndpoints(endpointIds);
      });
  }

  private async _updateUrlToReflectEndpoints(endpointIds: string[]) {
    let endpointsParam: string | null = null;
    if (endpointIds && endpointIds.length > 0) {
      endpointsParam = endpointIds.join(',');
    }

    setTimeout(async () => {
      await this._updateUrlParam(Settings.url.params.endpoints, endpointsParam);
    });
  }

  async updateUrlToReflectFilters(filters: FilterModel[]) {
    const combinedFiltersObject: FilterQueryParams = {};

    // Base filters
    const baseFiltersObject: FilterOptionsIdsModel =
      this.data.convertFiltersToIdsFormat(filters);

    if (Object.keys(baseFiltersObject).length > 0) {
      combinedFiltersObject.base = baseFiltersObject;
    }

    // Custom filters
    const customFiltersObject =
      this.customFiltersRegistry.getAllQueryParamValues();

    if (Object.keys(customFiltersObject).length > 0) {
      combinedFiltersObject.custom = customFiltersObject;
    }

    const combinedFiltersParam = JSON.stringify(combinedFiltersObject);

    console.log(
      'Updating URL to reflect filters',
      combinedFiltersParam.slice(0, 100) + '...',
      filters,
    );

    void this._updateUrlParam(
      Settings.url.params.filters,
      combinedFiltersParam,
    );
  }

  private async _updateUrlParam(key: string, param: string | null) {
    this.ignoreQueryParamChange = true;
    await this.router.navigate([], {
      queryParams: { [key]: param },
      queryParamsHandling: 'merge',
    });
    this.ignoreQueryParamChange = false;
  }

  addParamToUrl(url: string, paramName: string, paramValue: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, paramValue);
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  }

  async processUrls(urls: string[], linkToDetails = true): Promise<string[]> {
    const promises = urls.map(
      async (url) => await this.processUrl(url, linkToDetails),
    );
    const processedUrls: string[] = await Promise.all(promises);
    return processedUrls;
  }

  async processUrl(url: string, linkToDetails = true): Promise<string> {
    const urlProcessor = Settings.endpoints.urlProcessor;
    if (urlProcessor && url && url.includes(urlProcessor.matchSubstring)) {
      const processedResponse = await this.api.postData<SuraResponse>(
        urlProcessor.url + `?url=${url}`,
        null,
      );
      return processedResponse.url;
      // url = this.addParamToUrl(
      //   url,
      //   'token',
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTE3MDY0NjQsIm5iZiI6MTcxMTcwNjQ2NCwiZXhwIjoxNzQzMjQyNDY0fQ.ViNS0wWml0EwkF0z75G4cNZxKupYQMLiVB_PQ5kNQm8',
      // );
      // return url;
    }

    if (linkToDetails) {
      return this.details.getLinkFromUrl(url);
    }

    url = url.replaceAll(
      'hetutrechtsarchief.nl/id',
      'hetutrechtsarchief.nl/collectie',
    );
    return url;
  }

  getPageNumberFromUrl(): number | null {
    // Get page number from query param
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get(Settings.url.params.page);

    if (pageParam) {
      const pageNum = Number(pageParam);
      return !isNaN(pageNum) && pageNum > 0 ? pageNum : null;
    }

    // Get page number from hashtag in URL
    const removeQueryParams = (url: string) => {
      const queryParamIndex = url.indexOf('?');
      if (queryParamIndex !== -1) {
        return url.substring(0, queryParamIndex);
      }
      return url;
    };

    let url = removeQueryParams(this.router.url);

    // Double encoded hashtag (%2523): Once by Angular router, once by encodeURIComponent (see Details service)
    const doubleEncodedHashtag = '%2523';
    const urlSplitByHashtag = url.split(doubleEncodedHashtag);
    const urlHasHashtag = urlSplitByHashtag.length > 1;
    if (urlHasHashtag) {
      const pageStr: string = urlSplitByHashtag[1];
      const pageNum = Number(pageStr);
      return !isNaN(pageNum) ? pageNum : null;
    }
    return null;
  }

  async updatePageInUrl(pageNumber: number | null) {
    const url = new URL(window.location.href);

    if (pageNumber) {
      url.searchParams.set(Settings.url.params.page, pageNumber.toString());
    } else {
      url.searchParams.delete(Settings.url.params.page);
    }

    // Use replaceState directly to avoid creating browser history entries
    window.history.replaceState({}, '', url.toString());
  }

  async navigateByUrlIgnoringQueryParamChange(url: string) {
    this.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.ignoreQueryParamChange = false;
  }
}
