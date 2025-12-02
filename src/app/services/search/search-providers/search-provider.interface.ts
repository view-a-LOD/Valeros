import { FilterModel } from '../../../models/filters/filter.model';
import { NodeModel } from '../../../models/node.model';

export interface SearchRequest {
  query: string;
  page: number;
  pageSize: number;
  filters: FilterModel[];
}

export interface SearchResponse {
  nodes: NodeModel[];
  total: number;
  isCapped: boolean;
}

export abstract class SearchProvider {
  abstract searchNodes(request: SearchRequest): Promise<SearchResponse>;
}
