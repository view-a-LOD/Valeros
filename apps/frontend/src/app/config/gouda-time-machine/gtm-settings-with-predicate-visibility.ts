import { PredicateVisibility } from '../../models/settings/predicate-visibility-settings.model';
import { SettingsModel } from '../../models/settings/settings.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { ViewMode } from '../../models/view-mode.enum';
import { defaultSettings } from '../default-settings/default-settings';
import { gtmSettingsWithRenderComponents } from './gtm-settings-with-render-components';

export const gtmSettingsWithPredicateVisibility: SettingsModel = {
  ...gtmSettingsWithRenderComponents,
  viewModes: {
    [ViewMode.List]: {
      ...defaultSettings.viewModes[ViewMode.List],
      [ViewModeSetting.ShowTypes]: false,
      [ViewModeSetting.ShowParents]: false,
    },
    [ViewMode.Grid]: {
      ...defaultSettings.viewModes[ViewMode.Grid],
      [ViewModeSetting.ShowTypes]: false,
      [ViewModeSetting.ShowParents]: false,
    },
  },
  predicateVisibility: {
    byViewMode: {
      [ViewMode.List]: {
        [PredicateVisibility.SearchHits]: [
          {
            predicates: [
              'https://schema.org/creator',
              'https://schema.org/locationCreated',
            ],
          },
        ],
        [PredicateVisibility.Details]: [
          {
            predicates: [
              'https://schema.org/description',
              'https://schema.org/locationCreated',
              'https://schema.org/spatialCoverage',
              'https://schema.org/image',
              'https://schema.org/thumbnailUrl',
              '*',
            ],
          },
        ],
        [PredicateVisibility.Hide]: [{ predicates: [] }],
      },
      [ViewMode.Grid]: {
        [PredicateVisibility.SearchHits]: [],
        [PredicateVisibility.Details]: [],
        [PredicateVisibility.Hide]: [],
      },
    },
    alwaysHide: [...defaultSettings.predicateVisibility.alwaysHide],
    hideTypeBadges: [],
  },
};
