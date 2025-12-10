import {
  PredicateVisibility,
  PredicateVisibilitySettings,
} from '../../../models/settings/predicate-visibility-settings.model';
import { ViewMode } from '../../../models/view-mode.enum';
import { typePredicates } from './predicate.settings';

export const predicateVisibilitySettings: PredicateVisibilitySettings = {
  byViewMode: {
    [ViewMode.List]: {
      [PredicateVisibility.SearchHits]: [{ predicates: ['*'] }],
      [PredicateVisibility.Details]: [],
      [PredicateVisibility.Hide]: [],
    },
    [ViewMode.Grid]: {
      [PredicateVisibility.SearchHits]: [],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
  },
  alwaysHide: ['@id', 'endpointId', ...typePredicates],
  hideTypeBadges: [],
};
