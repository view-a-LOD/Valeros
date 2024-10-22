import { Injectable } from '@angular/core';
import { DetailsService } from './details.service';
import { FilterModel } from '../models/filter.model';
import { Config } from '../config/config';
import { FilterService } from './search/filter.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  ignoreQueryParamChange = false;

  constructor(
    private details: DetailsService,
    private filters: FilterService,
    private router: Router,
  ) {
    this._initUpdateUrlOnFilterChange();
  }

  private _initUpdateUrlOnFilterChange() {
    this.filters.enabled.subscribe((enabledFilters) => {
      void this.updateUrlToReflectFilters(enabledFilters);
    });
  }

  async updateUrlToReflectFilters(filters: FilterModel[]) {
    const enabledFiltersParam = JSON.stringify(
      this.filters.convertToUrlFormat(filters),
    );

    console.log(
      'Updating URL to reflect filters',
      enabledFiltersParam,
      filters,
    );

    this.ignoreQueryParamChange = true;
    await this.router.navigate([], {
      queryParams: { [Config.filtersParam]: enabledFiltersParam },
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

  processUrls(urls: string[], linkToDetails = true): string[] {
    return urls.map((url) => this.processUrl(url, linkToDetails));
  }

  processUrl(url: string, linkToDetails = true): string {
    if (linkToDetails) {
      return this.details.getLinkFromUrl(url);
    }

    if (url.includes('opslag.razu.nl')) {
      url = this.addParamToUrl(
        url,
        'token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTE3MDY0NjQsIm5iZiI6MTcxMTcwNjQ2NCwiZXhwIjoxNzQzMjQyNDY0fQ.ViNS0wWml0EwkF0z75G4cNZxKupYQMLiVB_PQ5kNQm8',
      );
    }

    url = url.replaceAll(
      'hetutrechtsarchief.nl/id',
      'hetutrechtsarchief.nl/collectie',
    );
    return url;
  }
}
