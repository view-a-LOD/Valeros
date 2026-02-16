import { PredicateVisibility } from '../../models/settings/predicate-visibility-settings.model';
import { SettingsModel } from '../../models/settings/settings.model';
import { ViewMode } from '../../models/view-mode.enum';
import { BackendSearchProvider } from '../../services/search/search-providers/backend-search-provider/backend-search.provider';
import { defaultSettings } from '../default-settings/default-settings';

export const backendSettings: SettingsModel = defaultSettings;

// Show organizations filter
backendSettings.filtering = {
  ...defaultSettings.filtering,
  showOrganizationsFilter: true,
};

// Set search provider
backendSettings.endpoints = {
  ...defaultSettings.endpoints,
  searchProvider: BackendSearchProvider,
  data: {},
};

// Configure what to show in search hits
backendSettings.predicateVisibility.byViewMode = {
  [ViewMode.List]: {
    [PredicateVisibility.SearchHits]: [
      {
        predicates: ['*'],
      },
    ],
    [PredicateVisibility.Details]: [{ predicates: ['*'] }],
    [PredicateVisibility.Hide]: [{ predicates: [] }],
  },
  [ViewMode.Grid]: {
    [PredicateVisibility.SearchHits]: [],
    [PredicateVisibility.Details]: [{ predicates: ['*'] }],
    [PredicateVisibility.Hide]: [],
  },
};
