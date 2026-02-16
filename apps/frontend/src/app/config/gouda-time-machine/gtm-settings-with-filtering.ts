import { SettingsModel } from '../../models/settings/settings.model';
import { SPARQLFilterOptionsProvider } from '../../services/search/filter-options-providers/sparql-filter-options.provider';
import { defaultSettings } from '../default-settings/default-settings';
import { gtmSettingsWithCustomContent } from './gtm-settings-with-custom-content';

export const gtmSettingsWithFiltering: SettingsModel = {
  ...gtmSettingsWithCustomContent,
  filtering: {
    ...defaultSettings.filtering,
    filterOptions: {
      type: {
        label: 'Type',
        fieldIds: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
        values: [],
      },
      creator: {
        label: 'Creator',
        fieldIds: ['https://schema.org/creator'],
        values: [],
      },
    },
    filterOptionsProvider: SPARQLFilterOptionsProvider,
  },
};
