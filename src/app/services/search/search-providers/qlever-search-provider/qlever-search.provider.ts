import { Injectable } from '@angular/core';
import { EndpointUrlsModel } from '../../../../models/endpoint.model';
import { Direction, NodeModel } from '../../../../models/node.model';
import { EndpointService } from '../../../endpoint.service';
import { SparqlService } from '../../../sparql.service';
import {
  SearchProvider,
  SearchRequest,
  SearchResponse,
} from '../search-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class QLeverSearchProvider extends SearchProvider {
  constructor(
    private endpoints: EndpointService,
    private sparql: SparqlService,
  ) {
    super();
  }

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const term = request.query?.trim();

    if (!term) {
      return { nodes: [], total: 0, isCapped: false };
    }

    const endpoint: EndpointUrlsModel = this.endpoints.getFirstUrls();

    const sparqlQuery = `
SELECT 
  ?subject 
WHERE {
  ?text ql:contains-entity ?subject .
  ?text ql:contains-word "${term}*" .
}
LIMIT ${request.pageSize}
OFFSET ${request.page * request.pageSize}`;

    type QLeverRow = {
      subject: string;
    };

    const rows: QLeverRow[] = await this.sparql.executeRawQuery<QLeverRow[]>(
      sparqlQuery,
      endpoint.sparql,
    );

    const endpointId: string = this.endpoints.getIdBySparqlUrl(endpoint.sparql);

    const nodes: NodeModel[] = rows.map((row) => {
      const node: NodeModel = {
        '@id': [{ value: row.subject, direction: Direction.Outgoing }],
        endpointId: endpointId
          ? [{ value: endpointId, direction: Direction.Outgoing }]
          : [],
      };

      return node;
    });

    return {
      nodes,
      total: nodes.length,
      isCapped: false,
    };
  }
}
