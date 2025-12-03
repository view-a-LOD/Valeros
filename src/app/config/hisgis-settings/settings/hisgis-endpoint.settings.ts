import { EndpointSettings } from '../../../models/settings/endpoint-settings.model';
import { ElasticSearchProvider } from '../../../services/search/search-providers/elastic-search-provider/elastic-search.provider';
import { endpointSettings } from '../../default-settings/settings/endpoint.settings';

export const hisgisEndpointSettings: EndpointSettings = {
  ...endpointSettings,
  searchProvider: ElasticSearchProvider,
  data: {
    hisgis: {
      label: 'HISGIS',
      endpointUrls: [
        {
          elastic:
            'https://data.netwerkdigitaalerfgoed.nl/_api/datasets/hetutrechtsarchief/HISGIStest/services/HISGIStest/_search',
          sparql:
            'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/HISGIStest/sparql',
        },
      ],
    },
  },
};
