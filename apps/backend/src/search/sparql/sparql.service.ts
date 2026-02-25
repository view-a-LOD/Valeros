import { QueryEngine } from '@comunica/query-sparql';
import { Bindings } from '@comunica/types';
import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import {
  ExecutionMode,
  SearchQueryModel,
  SearchResponseModel,
  SearchResult,
  SingleEndpointQueryModel,
} from '@valeros/shared/types';
import { SparqlNodeConverter } from './sparql-node-converter';
import { SparqlQueryBuilder } from './sparql-query-builder';
import { SparqlResponseBuilder } from './sparql-response-builder';

@Injectable()
export class SparqlService {
  private readonly logger = new Logger(SparqlService.name);
  private readonly queryEngine = new QueryEngine();

  async searchNodes(query: SearchQueryModel): Promise<SearchResponseModel> {
    const startTime: number = Date.now();

    if (!query.endpoints?.length) {
      this.logger.warn('No endpoints provided for SPARQL search');
      return SparqlResponseBuilder.createEmptyResponse();
    }

    this.logger.log(
      `Searching SPARQL endpoints: ${query.endpoints.map((e) => e.url).join(', ')}`,
    );

    const searchResponse: SearchResponseModel =
      await this.queryEndpoints(query);

    const executionTime: number = Date.now() - startTime;
    searchResponse.metadata.executionTime = executionTime;

    return searchResponse;
  }

  private async queryEndpoints(
    request: SearchQueryModel,
  ): Promise<SearchResponseModel> {
    const { executionMode } = request;
    const mode: ExecutionMode = executionMode ?? 'async';

    switch (mode) {
      case 'async':
        return this.queryEndpointsAsync(request);

      case 'federated':
        // TODO: Implement federated queries using Comunica
        throw new NotImplementedException(
          'Federated query execution is not yet implemented',
        );

      default:
        throw new Error(`Unknown execution mode: ${mode}`);
    }
  }

  private async queryEndpointsAsync(
    request: SearchQueryModel,
  ): Promise<SearchResponseModel> {
    const { endpoints } = request;
    const endpointUrls = endpoints?.map((endpoint) => endpoint.url) || [];

    const queryPromises = endpointUrls.map((endpointUrl) => {
      const singleEndpointQuery: SingleEndpointQueryModel = {
        ...request,
        endpointUrl,
      };
      return this.querySingleEndpointWithTiming(singleEndpointQuery);
    });

    const responses: SearchResponseModel[] = await Promise.all(queryPromises);

    return SparqlResponseBuilder.aggregateSearchResponses(responses);
  }

  private async querySingleEndpointWithTiming(
    query: SingleEndpointQueryModel,
  ): Promise<SearchResponseModel> {
    const startTime = Date.now();

    const endpointUrl = query.endpointUrl;

    try {
      const results = await this.querySingleEndpoint(query);

      const queryTime = Date.now() - startTime;

      return SparqlResponseBuilder.createSingleEndpointResponse(
        endpointUrl,
        results,
        queryTime,
        'success',
      );
    } catch (error) {
      const queryTime = Date.now() - startTime;
      this.logger.warn(
        `Failed to query ${query.endpointUrl}: ${(error as Error).message}`,
      );

      return SparqlResponseBuilder.createSingleEndpointResponse(
        query.endpointUrl,
        [],
        queryTime,
        'error',
        (error as Error).message,
      );
    }
  }

  private async querySingleEndpoint(
    query: SingleEndpointQueryModel,
  ): Promise<SearchResult[]> {
    const sparqlQuery: string = SparqlQueryBuilder.buildSearchQuery(query);

    const bindings: Bindings[] = await this.queryEngine
      .queryBindings(sparqlQuery, {
        sources: [query.endpointUrl],
      })
      .then((stream) => stream.toArray());

    return SparqlNodeConverter.convertBindingsToSearchResults(
      bindings,
      query.endpointUrl,
    );
  }
}
