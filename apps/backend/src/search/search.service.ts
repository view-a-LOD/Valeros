import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  EndpointConfig,
  SearchQueryModel,
  SearchResponseModel,
} from '@valeros/shared/types';
import { SparqlService } from './sparql/sparql.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly sparqlService: SparqlService) {}

  async searchNodes(request: SearchQueryModel): Promise<SearchResponseModel> {
    const { query, page, pageSize, endpoints } = request;

    const sparqlEndpoints = this.validateAndFilterSparqlEndpoints(endpoints);

    const sparqlRequest: SearchQueryModel = {
      ...request,
      endpoints: sparqlEndpoints,
    };

    this.logger.log(
      `Search request - query: "${query}", page: ${page}, pageSize: ${pageSize}, SPARQL endpoints: ${sparqlEndpoints.length}`,
    );

    return this.sparqlService.searchNodes(sparqlRequest);
  }

  private validateAndFilterSparqlEndpoints(
    endpoints?: EndpointConfig[],
  ): EndpointConfig[] {
    if (!endpoints) {
      throw new BadRequestException(
        'At least one SPARQL endpoint must be provided',
      );
    }

    const sparqlEndpoints: EndpointConfig[] = endpoints.filter(
      (endpoint) => endpoint.type === 'sparql',
    );
    const otherEndpoints: EndpointConfig[] = endpoints.filter(
      (endpoint) => endpoint.type !== 'sparql',
    );

    otherEndpoints.forEach((endpoint) => {
      this.logger.warn(
        `Unsupported endpoint type '${endpoint.type}' for URL: ${endpoint.url}. Only SPARQL endpoints are currently supported.`,
      );
    });

    if (sparqlEndpoints.length === 0) {
      throw new BadRequestException(
        'At least one SPARQL endpoint must be provided',
      );
    }

    return sparqlEndpoints;
  }
}
