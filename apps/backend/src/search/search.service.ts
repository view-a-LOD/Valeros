import { Injectable } from '@nestjs/common';
import {
  NodeModel,
  SearchRequest,
  SearchResponse,
} from '@valeros/shared/types';
import { mockNodes } from './mock-data';

@Injectable()
export class SearchService {
  private mockNodes: NodeModel[] = mockNodes;

  searchNodes(request: SearchRequest): SearchResponse {
    const { query, page, pageSize, filters } = request;
    // TODO: Implement filter functionality

    let filteredNodes = this.mockNodes;

    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredNodes = this.mockNodes.filter((node) => {
        const label =
          node['http://www.w3.org/2000/01/rdf-schema#label']?.[0]?.value;
        const description =
          node['http://purl.org/dc/terms/description']?.[0]?.value;
        return (
          label?.toLowerCase().includes(lowerQuery) ||
          description?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    const total = filteredNodes.length;
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedNodes = filteredNodes.slice(start, end);

    return {
      nodes: paginatedNodes,
      total,
      isCapped: false,
    };
  }
}
