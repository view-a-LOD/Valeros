export enum FilterType {
  Field = 0,
  Value = 1,
  FieldAndValue = 2,
}

export interface FilterModel {
  filterId?: string;
  fieldId?: string;
  valueId?: string;
  type: FilterType;
}
