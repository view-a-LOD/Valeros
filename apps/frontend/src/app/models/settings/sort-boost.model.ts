import { FilterOptionIdsModel } from '../filters/filter-option.model';

export interface SortBoostModel {
  boost: number;
  filter: FilterOptionIdsModel;
}
