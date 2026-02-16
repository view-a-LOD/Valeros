import { uiSettings } from '../../default-settings/settings/ui.settings';

export const hisgisUiSettings = {
  ...uiSettings,
  header: {
    ...uiSettings.header,
    logoPath: '/assets/img/home-logo.svg',
  },
  translations: {
    basePath: './assets/i18n/hisgis/',
    fileExtension: '.json',
  },
  siteTitlePrefix: 'HisGIS',
};
