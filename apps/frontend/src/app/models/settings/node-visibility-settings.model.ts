import { FilterOptionIdsModel } from '../filters/filter-option.model';

export interface NodeVisibilitySettings {
  onlyShow: {
    [key: string]: FilterOptionIdsModel;
  };
  alwaysHide: {
    [key: string]: FilterOptionIdsModel;
  };
}
