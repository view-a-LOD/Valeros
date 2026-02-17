import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SearchRequest, SearchResponse } from '@valeros/shared/types';
import { SparqlService } from './sparql/sparql.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly sparqlService: SparqlService) {}

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const { query, page, pageSize, endpoints } = request;

    this.logger.log(
      `Search request - query: "${query}", page: ${page}, pageSize: ${pageSize}, endpoints: ${endpoints?.length || 0}`,
    );

    if (!endpoints || endpoints.length === 0) {
      throw new BadRequestException(
        'At least one SPARQL endpoint must be provided',
      );
    }

    return this.sparqlService.searchNodes(request);
  }
}
