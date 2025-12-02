import { Injectable } from '@angular/core';
import { ElasticShouldQueries } from '../../../models/elastic/elastic-should-queries.type';

@Injectable({
  providedIn: 'root',
})
export abstract class CustomFilterService<TParams = any> {
  abstract getElasticQueries(): ElasticShouldQueries[];
  abstract getQueryParamValues(): TParams;
  abstract updateFromQueryParamValues(queryParamValues: TParams): void;
  abstract getEnabledFilterCount(): number;
  abstract clear(): void;
}
