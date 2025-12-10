import { SettingsModel } from '../../models/settings/settings.model';
import { SPARQLSearchProvider } from '../../services/search/search-providers/sparql-search-provider/sparql-search.provider';
import { defaultSettings } from '../default-settings/default-settings';

export const gtmBasicSettings: SettingsModel = {
  ...defaultSettings,
  endpoints: {
    ...defaultSettings.endpoints,
    data: {
      goudaTijdmachine: {
        label: 'Gouda Tijdmachine',
        endpointUrls: [
          { sparql: 'https://qlever.coret.org/gtm-geo-beeldbank' },
          // { sparql: 'https://api.triplydb.com/datasets/none/sdo/sparql' },
          // { sparql: 'https://api.triplydb.com/datasets/w3c/rdf/sparql' },
          // { sparql: 'https://api.triplydb.com/datasets/w3c/rdfs/sparql' },
          // { sparql: 'https://api.triplydb.com/datasets/ica/rico/sparql' },
        ],
      },
    },
    searchProvider: SPARQLSearchProvider,
  },
  predicates: {
    ...defaultSettings.predicates,
    label: [
      ...defaultSettings.predicates.label,
      'https://schema.org/description',
    ],
  },
};
