import { FilterModel } from './filter.types';
import { NodeModel } from './node.types';

export interface SearchRequest {
  query: string;
  page: number;
  pageSize: number;
  filters: FilterModel[];
  endpoints?: string[];
}

export interface SearchResponse {
  nodes: NodeModel[];
  total: number;
  isCapped: boolean;
}
