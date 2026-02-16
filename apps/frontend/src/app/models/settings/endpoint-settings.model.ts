import { Type } from '@angular/core';
import type { SearchProvider } from '../../services/search/search-providers/search-provider.interface';
import { EndpointsModel } from '../endpoint.model';

export interface EndpointSettings {
  maxNumParallelRequests: number;
  data: EndpointsModel;
  /**
   * e.g. ElasticSearchProvider for elastic-based search or SPARQLSearchProvider for SPARQL-based search.
   */
  searchProvider?: Type<SearchProvider>;
  pdfConversionUrl?: string;
  urlProcessor?: {
    url: string;
    matchSubstring: string;
  };
  snippetServer?: string;
}
