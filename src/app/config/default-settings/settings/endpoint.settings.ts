import { EndpointSettings } from '../../../models/settings/endpoint-settings.model';
import { SPARQLSearchProvider } from '../../../services/search/search-providers/sparql-search-provider/sparql-search.provider';

export const endpointSettings: EndpointSettings = {
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  data: {},
  searchProvider: SPARQLSearchProvider,
};
