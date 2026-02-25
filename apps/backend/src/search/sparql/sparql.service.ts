import { QueryEngine } from '@comunica/query-sparql';
import type { Bindings } from '@comunica/types';
import { Injectable, Logger } from '@nestjs/common';
import {
  EndpointInfo,
  SearchQueryModel,
  SearchResponseModel,
  SearchResult,
} from '@valeros/shared/types';
import { SparqlNodeConverter } from './sparql-node-converter';
import { SparqlQueryBuilder } from './sparql-query-builder';

interface QueryEndpointsResult {
  results: SearchResult[];
  endpointInfos: EndpointInfo[];
}

@Injectable()
export class SparqlService {
  private readonly logger = new Logger(SparqlService.name);
  private readonly queryEngine = new QueryEngine();

  async searchNodes(request: SearchQueryModel): Promise<SearchResponseModel> {
    const startTime: number = Date.now();
    const { query, page, pageSize, endpoints, languages } = request;

    const endpointUrls: string[] =
      endpoints?.map((endpoint) => endpoint.url) || [];

    if (!endpointUrls || endpointUrls.length === 0) {
      return this.createEmptyResponse();
    }

    this.logger.log(`Searching SPARQL endpoints: ${endpointUrls.join(', ')}`);

    const { results, endpointInfos }: QueryEndpointsResult =
      await this.queryEndpoints(endpointUrls, query, page, pageSize, languages);

    const executionTime: number = Date.now() - startTime;

    return {
      metadata: {
        totalHits: results.length,
        returnedHits: results.length,
        executionTime,
        endpoints: endpointInfos,
      },
      results,
      links: {
        self: '',
      },
    };
  }

  private createEmptyResponse(): SearchResponseModel {
    return {
      metadata: {
        totalHits: 0,
        returnedHits: 0,
        endpoints: [],
      },
      results: [],
      links: {
        self: '',
      },
    };
  }

  private async queryEndpoints(
    endpoints: string[],
    searchTerm: string,
    page: number,
    pageSize: number,
    languages?: string[],
  ): Promise<QueryEndpointsResult> {
    const allResults: SearchResult[] = [];
    const endpointInfos: EndpointInfo[] = [];

    // TODO: Use Comunica's federated queries instead of querying each endpoint separately
    for (const endpoint of endpoints) {
      const startTime = Date.now();
      try {
        const results = await this.querySingleEndpoint(
          endpoint,
          searchTerm,
          page,
          pageSize,
          languages,
        );

        const queryTime = Date.now() - startTime;

        allResults.push(...results);

        endpointInfos.push({
          id: endpoint,
          hitCount: results.length,
          queryTime,
          status: 'success',
        });
      } catch (error) {
        const queryTime = Date.now() - startTime;
        this.logger.warn(
          `Failed to query ${endpoint}: ${(error as Error).message}`,
        );

        endpointInfos.push({
          id: endpoint,
          hitCount: 0,
          queryTime,
          status: 'error',
          error: (error as Error).message,
        });
      }
    }

    return {
      results: allResults,
      endpointInfos,
    };
  }

  private async querySingleEndpoint(
    endpoint: string,
    searchTerm: string,
    page: number,
    pageSize: number,
    languages?: string[],
  ): Promise<SearchResult[]> {
    const sparqlQuery = SparqlQueryBuilder.buildSearchQuery(
      searchTerm,
      page,
      pageSize,
      languages,
    );

    const bindings: Bindings[] = await this.queryEngine
      .queryBindings(sparqlQuery, {
        sources: [endpoint],
      })
      .then((stream) => stream.toArray());

    return SparqlNodeConverter.convertBindingsToSearchResults(
      bindings,
      endpoint,
    );
  }
}
