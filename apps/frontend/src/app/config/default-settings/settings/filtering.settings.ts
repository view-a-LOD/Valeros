import { FilteringSettings } from '../../../models/settings/filtering-settings.model';
import { SPARQLFilterOptionsProvider } from '../../../services/search/filter-options-providers/sparql-filter-options.provider';

export const filteringSettings: FilteringSettings = {
  showFilterPanel: true,
  showOrganizationsFilter: false,
  minNumOfValuesForFilterOptionToAppear: 1,
  filterOptions: {},
  filterOptionsProvider: SPARQLFilterOptionsProvider,
};

// Example:
// filterOptions: {
//   license: {
//     label: 'Licentie',
//     fieldIds: ['https://schema.org/license'],
//     values: [],
//   },
// },
