import { SettingsModel } from '../../models/settings/settings.model';
import { defaultSettings } from '../default-settings/default-settings';
import { gtmSettingsWithPredicateVisibility } from './gtm-settings-with-predicate-visibility';

export const gtmSettingsWithCustomContent: SettingsModel = {
  ...gtmSettingsWithPredicateVisibility,
  content: {
    ...defaultSettings.content,
    translations: { basePath: './assets/i18n/gtm/', fileExtension: '.json' },
    // sparqlLanguageFilterForLiterals: ['nl', 'nl-nl'],
  },
  ui: {
    ...defaultSettings.ui,
    labelMaxChars: 400,
    header: {
      ...defaultSettings.ui.header,
      logoPath: '/assets/img/gtm/logo.svg',
    },
  },
};
