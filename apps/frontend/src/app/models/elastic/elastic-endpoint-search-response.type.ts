import type { estypes } from '@elastic/elasticsearch';

export type ElasticEndpointSearchResponse<T> = estypes.SearchResponse<T> & {
  endpointId: string;
};
