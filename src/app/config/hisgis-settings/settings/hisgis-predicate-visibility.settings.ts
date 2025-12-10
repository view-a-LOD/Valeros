import {
  PredicateVisibility,
  PredicateVisibilitySettings,
} from '../../../models/settings/predicate-visibility-settings.model';
import { ViewMode } from '../../../models/view-mode.enum';
import { predicateVisibilitySettings } from '../../default-settings/settings/predicate-visibility.settings';
import { labelPredicates } from '../../default-settings/settings/predicate.settings';

export const hisgisPredicateVisibilitySettings: PredicateVisibilitySettings = {
  ...predicateVisibilitySettings,
  byViewMode: {
    [ViewMode.List]: {
      [PredicateVisibility.SearchHits]: [
        { predicates: ['http://www.opengis.net/ont/geosparql#asWKT'] },
      ],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
    [ViewMode.Grid]: {
      [PredicateVisibility.SearchHits]: [
        { predicates: ['http://www.opengis.net/ont/geosparql#asWKT'] },
      ],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
  },
  alwaysHide: [...predicateVisibilitySettings.alwaysHide, ...labelPredicates],
};
