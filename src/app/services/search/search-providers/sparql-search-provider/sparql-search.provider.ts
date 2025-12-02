import { Injectable } from '@angular/core';
import { Settings } from '../../../../config/settings';
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
export class SPARQLSearchProvider extends SearchProvider {
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

    const labelPredicates = Settings.predicates.label
      .map((iri) => `<${iri}>`)
      .join(' ');

    const sparqlQuery = `
SELECT ?s ?p ?o
WHERE {
  {
    SELECT DISTINCT ?s
    WHERE {
      VALUES ?labelPred { ${labelPredicates} }
      ?s ?labelPred ?label .
      FILTER(CONTAINS(STR(?label), "${term}"))
    }
    LIMIT ${request.pageSize}
    OFFSET ${request.page * request.pageSize}
  }

  ?s ?p ?o .
}`;

    type SPARQLRow = {
      s: string;
      p: string;
      o: string;
    };

    const rows: SPARQLRow[] = await this.sparql.executeRawQuery<SPARQLRow[]>(
      sparqlQuery,
      endpoint.sparql,
    );

    const endpointId: string = this.endpoints.getIdBySparqlUrl(endpoint.sparql);

    const nodeMap = new Map<string, NodeModel>();

    for (const row of rows) {
      let node = nodeMap.get(row.s);

      if (!node) {
        node = {
          '@id': [{ value: row.s, direction: Direction.Outgoing }],
          endpointId: endpointId
            ? [{ value: endpointId, direction: Direction.Outgoing }]
            : [],
        };

        nodeMap.set(row.s, node);
      }

      (node[row.p] = node[row.p] || []).push({
        value: row.o,
        direction: Direction.Outgoing,
      });
    }

    const nodes: NodeModel[] = Array.from(nodeMap.values());
    return {
      nodes,
      total: nodes.length,
      isCapped: false,
    };
  }
}
