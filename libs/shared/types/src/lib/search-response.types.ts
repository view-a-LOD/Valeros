import type { Term } from '@rdfjs/types';

export type TermType = Term['termType'];

export type SearchResponseModel = {
  metadata: ResponseMetadata;
  results: SearchResult[];
  links: PaginationLinks;
};

export type ResponseMetadata = {
  totalHits: number;
  returnedHits: number;
  executionTime?: number;
  endpoints: EndpointInfo[];
};

export type PaginationLinks = {
  self: string;
  next?: string;
  prev?: string;
};

export type EndpointInfo = {
  url: string;
  title?: string;
  description?: string;
  hitCount: number;
  queryTime?: number;
  status: 'success' | 'error';
  error?: string;
};

export type SearchResult = {
  id: string;
  endpointUrls: string[];
  properties: Record<string, PropertyValue[]>;
  outgoing?: SearchResult[];
  incoming?: SearchResult[];
};

export type PropertyValue = {
  value: string;
  type: TermType;
  language?: string;
  datatype?: string;
  direction?: 'ltr' | 'rtl' | '' | null;
  label?: string;
  highlight?: string;
};
