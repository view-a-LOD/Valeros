import { Injectable, Logger } from '@nestjs/common';
import {
  Direction,
  NodeModel,
  SearchRequest,
  SearchResponse,
} from '@valeros/shared/types';

@Injectable()
export class SparqlSearchService {
  private readonly logger = new Logger(SparqlSearchService.name);

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const { query, endpoints } = request;

    this.logger.log(
      `SPARQL search demo: query="${query}", endpoints=${endpoints?.join(', ')}`,
    );

    const demoNodes: NodeModel[] = [
      {
        '@id': [
          {
            value: 'http://example.org/resource/1',
            direction: Direction.Outgoing,
          },
        ],
        'http://www.w3.org/2000/01/rdf-schema#label': [
          {
            value: `SPARQL Demo Result for "${query}"`,
            direction: Direction.Outgoing,
          },
        ],
        endpointId: [
          {
            value: endpoints?.[0] || 'http://example.org/sparql',
            direction: Direction.Outgoing,
          },
        ],
      },
    ];

    return {
      nodes: demoNodes,
      total: 1,
      isCapped: false,
    };
  }
}
