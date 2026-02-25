import {
  EndpointInfo,
  SearchResponseModel,
  SearchResult,
} from '@valeros/shared/types';

export class SparqlResponseBuilder {
  static createEmptyResponse(): SearchResponseModel {
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

  static createSingleEndpointResponse(
    endpointUrl: string,
    results: SearchResult[],
    queryTime: number,
    status: 'success' | 'error',
    errorMessage?: string,
  ): SearchResponseModel {
    return {
      metadata: {
        totalHits: results.length,
        returnedHits: results.length,
        endpoints: [
          {
            url: endpointUrl,
            hitCount: results.length,
            queryTime,
            status,
            ...(errorMessage && { error: errorMessage }),
          },
        ],
      },
      results,
      links: {
        self: '',
      },
    };
  }

  static aggregateSearchResponses(
    responses: SearchResponseModel[],
  ): SearchResponseModel {
    const allResults: SearchResult[] = [];
    const endpointInfos: EndpointInfo[] = [];

    for (const response of responses) {
      allResults.push(...response.results);
      endpointInfos.push(...response.metadata.endpoints);
    }

    // TODO: Handle duplicates and merge endpoint infos

    return {
      metadata: {
        totalHits: allResults.length,
        returnedHits: allResults.length,
        endpoints: endpointInfos,
      },
      results: allResults,
      links: {
        self: '',
      },
    };
  }
}
