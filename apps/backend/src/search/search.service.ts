import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchRequest, SearchResponse } from '@valeros/shared/types';
import { SparqlService } from './sparql/sparql.service';

@Injectable()
export class SearchService {
  constructor(private readonly sparqlService: SparqlService) {}

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const { endpoints } = request;

    if (!endpoints || endpoints.length === 0) {
      throw new BadRequestException(
        'At least one SPARQL endpoint must be provided',
      );
    }

    return this.sparqlService.searchNodes(request);
  }
}
