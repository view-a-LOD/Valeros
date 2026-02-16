import {
  PredicateVisibility,
  PredicateVisibilitySettings,
} from '../../../models/settings/predicate-visibility-settings.model';
import { ViewMode } from '../../../models/view-mode.enum';
import { predicateVisibilitySettings } from '../../default-settings/settings/predicate-visibility.settings';
import { labelPredicates } from '../../default-settings/settings/predicate.settings';

export const triplyPredicateVisibilitySettings: PredicateVisibilitySettings = {
  ...predicateVisibilitySettings,
  byViewMode: {
    [ViewMode.List]: {
      [PredicateVisibility.SearchHits]: [
        {
          predicates: [
            'https://triplydb.com/academy/pokemon/vocab/type',
            'https://triplydb.com/academy/pokemon/vocab/species',
          ],
        },
      ],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
    [ViewMode.Grid]: {
      ...predicateVisibilitySettings.byViewMode[ViewMode.Grid],
    },
  },
  alwaysHide: [...predicateVisibilitySettings.alwaysHide, ...labelPredicates],
};
