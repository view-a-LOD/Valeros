import { EndpointSettings } from '../../../models/settings/endpoint-settings.model';
import { endpointSettings } from '../../default-settings/settings/endpoint.settings';

export const triplyEndpointSettings: EndpointSettings = {
  ...endpointSettings,
  data: {
    pokemon: {
      label: 'Pokemon',
      endpointUrls: [
        {
          elastic:
            'https://triplydb.com/_api/datasets/academy/pokemon/services/search/_search',
          sparql: 'https://api.triplydb.com/datasets/academy/pokemon/sparql',
        },
      ],
    },
    iris: {
      label: 'Iris',
      endpointUrls: [
        {
          elastic:
            'https://triplydb.com/_api/datasets/Triply/iris/services/iris-es/_search',
          sparql: 'https://api.triplydb.com/datasets/Triply/iris/sparql',
        },
      ],
    },
  },
};
