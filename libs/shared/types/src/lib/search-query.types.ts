/** @format */

export type EndpointType = 'sparql' | 'qlever' | 'elastic';

export type ExecutionMode = 'federated' | 'async';

export type EndpointConfig = {
  type: EndpointType;
  url: string;
};

type BaseQueryModel = {
  query: string;
  page: number;
  pageSize: number;
  languages?: string[];
  prefixes?: PrefixModel[];
  filters: SearchQueryFilterModel[];
  sorting: SortingModel;
  retrieve?: RetrieveConfig;
  executionMode?: ExecutionMode;
};

export type SearchQueryModel = BaseQueryModel & {
  endpoints: EndpointConfig[];
};

export type SingleEndpointQueryModel = BaseQueryModel & {
  endpointUrl: string;
};

export type SearchQueryFilterModel = {
  predicates?: string[];
  objects?: string[];
};

export type SortingModel = {
  predicates: string[];
  direction: 'asc' | 'desc';
};

export type PrefixModel = {
  prefix: string;
  namespace: string;
};

export type NodeScope = 'roots' | 'all';

export type PropertyPath = string; // SPARQL property path syntax with prefixes or <full_urls>

export type Prefix = {
  prefix: string;
  namespace: string;
};

export type PathSelector = {
  path: PropertyPath;
  includeHighlights?: boolean;
};

export type RetrieveSelector = {
  scope: NodeScope;
  paths: PathSelector[];
};

export type RetrieveConfig = {
  selectors: RetrieveSelector[];
  prefixes?: Prefix[];
};
