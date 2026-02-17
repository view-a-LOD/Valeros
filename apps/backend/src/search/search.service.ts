import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  EndpointConfig,
  SearchQueryModel,
  SearchResponse,
} from '@valeros/shared/types';
import { SparqlService } from './sparql/sparql.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly sparqlService: SparqlService) {}

  async searchNodes(request: SearchQueryModel): Promise<SearchResponse> {
    const { query, page, pageSize, endpoints } = request;

    const sparqlEndpoints: EndpointConfig[] =
      endpoints?.filter((endpoint) => endpoint.type === 'sparql') || [];
    const otherEndpoints: EndpointConfig[] =
      endpoints?.filter((endpoint) => endpoint.type !== 'sparql') || [];

    otherEndpoints.forEach((endpoint) => {
      this.logger.warn(
        `Unsupported endpoint type '${endpoint.type}' for URL: ${endpoint.url}. Only SPARQL endpoints are currently supported.`,
      );
    });

    const endpointUrls: string[] = sparqlEndpoints.map(
      (endpoint) => endpoint.url,
    );

    this.logger.log(
      `Search request - query: "${query}", page: ${page}, pageSize: ${pageSize}, SPARQL endpoints: ${endpointUrls.length}`,
    );

    if (!endpointUrls || endpointUrls.length === 0) {
      throw new BadRequestException(
        'At least one SPARQL endpoint must be provided',
      );
    }

    const sparqlRequest: SearchQueryModel = {
      ...request,
      endpoints: sparqlEndpoints,
    };

    return this.sparqlService.searchNodes(sparqlRequest);
  }
}
