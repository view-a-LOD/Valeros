import { FilterType } from '../filters/filter.model';

export interface AutocompleteSettings {
  enabled: boolean;
  maxAutocompleteOptionsPerEndpoint: number;
  maxAutocompleteOptionsToShow: number;
  /**
   * Defines filter criteria to restrict which data entries appear as autocomplete suggestions.
   * Each filter specifies field and value constraints that determine eligible autocomplete options.
   */
  filtersForAutocompleteOptions: Record<
    string,
    {
      type: FilterType;
      fieldIds: string[];
      valueIds: string[];
    }
  >;
}
