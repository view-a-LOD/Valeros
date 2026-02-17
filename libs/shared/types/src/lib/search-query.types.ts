/** @format */

export type EndpointType = 'sparql' | 'qlever' | 'elastic';

export type EndpointConfig = {
  type: EndpointType;
  url: string;
};

export type SearchQueryModel = {
  query: string;
  page: number;
  pageSize: number;
  endpoints: EndpointConfig[];
  filters: SearchQueryFilterModel[];
  sorting: SortingModel;
  languages?: string[];
  prefixes?: PrefixModel[];
  retrieve?: RetrieveConfig;
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
