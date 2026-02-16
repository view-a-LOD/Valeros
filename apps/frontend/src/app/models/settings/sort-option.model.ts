import { SortBoostModel } from './sort-boost.model';
import { SortOrder } from './sort-order.enum';

export interface SortOptionModel {
  id?: string;
  fields: string[];
  label: string;
  order: SortOrder;
  boost?: { [id: string]: SortBoostModel };
}

export type SortOptionsModel = {
  [id: string]: SortOptionModel;
};
