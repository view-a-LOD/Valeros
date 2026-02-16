import { FilterOptionsIdsModel } from './filter-option.model';

export interface FilterQueryParams {
  base?: FilterOptionsIdsModel;
  custom?: { [filterId: string]: any };
}
