import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElasticShouldQueries } from '../../../models/elastic/elastic-should-queries.type';
import { CustomFilterService } from './custom-filter.service';

@Injectable({
  providedIn: 'root',
})
export class CustomFiltersRegistry {
  private _all = new BehaviorSubject<Map<string, CustomFilterService>>(
    new Map(),
  );

  getAll() {
    return this._all.value;
  }

  getTotalNumEnabled(): number {
    let count = 0;
    this._all.value.forEach((service: CustomFilterService) => {
      count += service.getEnabledFilterCount();
    });
    return count;
  }

  getAllElasticQueries(): ElasticShouldQueries[] {
    const allQueries: ElasticShouldQueries[] = [];

    this._all.value.forEach(
      (service: CustomFilterService, filterId: string) => {
        try {
          const queries = service.getElasticQueries();
          if (queries && queries.length > 0) {
            allQueries.push(...queries);
          }
        } catch (error) {
          console.warn(
            `Error getting queries for custom filter ${filterId}:`,
            error,
          );
        }
      },
    );

    return allQueries;
  }

  getAllQueryParamValues(): { [filterId: string]: any } {
    const allParams: { [filterId: string]: any } = {};

    this._all.value.forEach(
      (service: CustomFilterService, filterId: string) => {
        try {
          const paramValues = service.getQueryParamValues();
          if (paramValues && Object.keys(paramValues).length > 0) {
            allParams[filterId] = paramValues;
          }
        } catch (error) {
          console.warn(
            `Error getting query param values for custom filter ${filterId}:`,
            error,
          );
        }
      },
    );

    return allParams;
  }

  clearAll() {
    this._all.value.forEach(
      (service: CustomFilterService, filterId: string) => {
        service.clear();
      },
    );
  }

  register(filterId: string, service: CustomFilterService) {
    console.log('Registering custom filter service', filterId, service);
    const currentFilters = new Map(this._all.value);
    currentFilters.set(filterId, service);
    this._all.next(currentFilters);
  }

  unregister(filterId: string) {
    console.log('Unregistering custom filter service', filterId);
    const currentFilters = new Map(this._all.value);
    currentFilters.delete(filterId);
    this._all.next(currentFilters);
  }

  getService(filterId: string): CustomFilterService | undefined {
    return this._all.value.get(filterId);
  }

  hasService(filterId: string): boolean {
    return this._all.value.has(filterId);
  }
}
