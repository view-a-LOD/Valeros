import { Injectable, Logger } from '@nestjs/common';
import {
  NodeModel,
  SearchRequest,
  SearchResponse,
} from '@valeros/shared/types';
import { SparqlClient } from './sparql-client';
import { SparqlNodeConverter } from './sparql-node-converter';
import { SparqlQueryBuilder } from './sparql-query-builder';

@Injectable()
export class SparqlSearchService {
  private readonly logger = new Logger(SparqlSearchService.name);

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const { query, page, pageSize, endpoints } = request;

    if (!endpoints || endpoints.length === 0) {
      return { nodes: [], total: 0, isCapped: false };
    }

    this.logger.log(`Searching SPARQL endpoints: ${endpoints.join(', ')}`);

    const nodes = await this.queryEndpoints(endpoints, query, page, pageSize);

    return {
      nodes,
      total: nodes.length,
      isCapped: false,
    };
  }

  private async queryEndpoints(
    endpoints: string[],
    searchTerm: string,
    page: number,
    pageSize: number,
  ): Promise<NodeModel[]> {
    const allNodes: NodeModel[] = [];

    for (const endpoint of endpoints) {
      try {
        const nodes = await this.querySingleEndpoint(
          endpoint,
          searchTerm,
          page,
          pageSize,
        );
        allNodes.push(...nodes);
      } catch (error) {
        this.logger.warn(
          `Failed to query ${endpoint}: ${(error as Error).message}`,
        );
      }
    }

    return allNodes;
  }

  private async querySingleEndpoint(
    endpoint: string,
    searchTerm: string,
    page: number,
    pageSize: number,
  ): Promise<NodeModel[]> {
    const sparqlQuery = SparqlQueryBuilder.buildSearchQuery(
      searchTerm,
      page,
      pageSize,
    );
    const results = await SparqlClient.executeQuery(endpoint, sparqlQuery);
    return SparqlNodeConverter.convertResultsToNodes(results, endpoint);
  }
}
