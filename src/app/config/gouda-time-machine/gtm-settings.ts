import { SettingsModel } from '../../models/settings/settings.model';
import { defaultSettings } from '../default-settings/default-settings';

export const gtmSettings: SettingsModel = {
  ...defaultSettings,
  endpoints: {
    ...defaultSettings.endpoints,
    data: {
      goudaTimeMachine: {
        label: 'Gouda Time Machine',
        endpointUrls: [
          {
            sparql: 'https://qlever.coret.org/gtm-geo-beeldbank',
          },
        ],
      },
    },
  },
  predicates: {
    ...defaultSettings.predicates,
    label: [
      ...defaultSettings.predicates.label,
      'https://schema.org/description',
    ],
  },
  namespacePrefixes: {
    ...defaultSettings.namespacePrefixes,
    'https://schema.org/': 'schema:',
  },
};
