import { Injectable } from '@angular/core';
import { Settings } from '../../../../config/settings';
import { EndpointUrlsModel } from '../../../../models/endpoint.model';
import { Direction, NodeModel, NodeObj } from '../../../../models/node.model';
import { EndpointService } from '../../../endpoint.service';
import { SparqlService } from '../../../sparql.service';
import {
  SearchProvider,
  SearchRequest,
  SearchResponse,
} from '../search-provider.interface';

@Injectable({ providedIn: 'root' })
export class SPARQLSearchProvider extends SearchProvider {
  constructor(
    private endpoints: EndpointService,
    private sparql: SparqlService,
  ) {
    super();
  }

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    // TODO: Cancel existing requests if new search is triggered

    const term = request.query?.trim();

    // if (!term) {
    //   return { nodes: [], total: 0, isCapped: false };
    // }
    const endpoint: EndpointUrlsModel = this.endpoints.getFirstUrls();

    const federatedLabelQuery: string = this._getFederatedLabelQuery(term);

    const totalSubjectsCount: number = await this._getTotalSubjectsCount(
      federatedLabelQuery,
      endpoint,
    );

    if (totalSubjectsCount === 0) {
      return { nodes: [], total: 0, isCapped: false };
    }

    const subjectIds: string[] = await this._getPaginatedSubjectIds(
      federatedLabelQuery,
      endpoint,
      request,
    );

    if (!subjectIds || subjectIds.length === 0) {
      return { nodes: [], total: totalSubjectsCount, isCapped: false };
    }

    const nodes: NodeModel[] = await this._getNodesFromSubjectIds(
      subjectIds,
      endpoint,
    );

    return { nodes, total: totalSubjectsCount, isCapped: false };
  }

  private _getFederatedLabelQuery(term: string): string {
    const labelPredicates = Settings.predicates.label
      .map((iri) => `<${iri}>`)
      .join(' ');

    const labelQueryTemplate = `
      VALUES ?labelPred { ${labelPredicates} }
      ?s ?labelPred ?label .
      FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${term}")))`;

    return this.sparql.getFederatedQuery(labelQueryTemplate);
  }

  private async _getTotalSubjectsCount(
    federatedLabelQuery: string,
    endpoint: EndpointUrlsModel,
  ): Promise<number> {
    const countQuery = `
SELECT (COUNT(DISTINCT ?s) AS ?total)
WHERE {
  ${federatedLabelQuery}
}`;

    type CountRow = { total: string };

    const countRows: CountRow[] = await this.sparql.executeRawQuery<CountRow[]>(
      countQuery,
      endpoint.sparql,
    );

    return countRows.length > 0 ? Number(countRows[0].total) : 0;
  }

  private async _getPaginatedSubjectIds(
    federatedLabelQuery: string,
    endpoint: EndpointUrlsModel,
    request: SearchRequest,
  ): Promise<string[]> {
    const subjectsQuery = `
SELECT DISTINCT ?s
WHERE {
  ${federatedLabelQuery}
}
ORDER BY ?s
LIMIT ${request.pageSize}
OFFSET ${request.page * request.pageSize}`;

    type SubjectRow = { s: string };

    const subjectRows: SubjectRow[] = await this.sparql.executeRawQuery<
      SubjectRow[]
    >(subjectsQuery, endpoint.sparql);

    if (!subjectRows || subjectRows.length === 0) {
      return [];
    }

    return subjectRows.map((row) => row.s);
  }

  private async _getNodesFromSubjectIds(
    subjects: string[],
    endpoint: EndpointUrlsModel,
  ): Promise<NodeModel[]> {
    const subjectValues = subjects.map((s) => `<${s}>`).join(' ');

    const triplesTemplate = `
      VALUES ?s { ${subjectValues} }
      ?s ?p ?o .`;

    const federatedTriplesQuery =
      this.sparql.getFederatedQuery(triplesTemplate);

    const triplesQuery = `
SELECT ?s ?p ?o ?endpointUrl
WHERE {
  ${federatedTriplesQuery}
}`;

    type SPARQLRow = { s: string; p: string; o: string; endpointUrl?: string };

    const rows: SPARQLRow[] = await this.sparql.executeRawQuery<SPARQLRow[]>(
      triplesQuery,
      endpoint.sparql,
    );

    const nodeMap = new Map<string, NodeModel>();

    for (const row of rows) {
      let node = nodeMap.get(row.s);

      if (!node) {
        node = {
          '@id': [{ value: row.s, direction: Direction.Outgoing }],
          endpointId: [],
        };

        nodeMap.set(row.s, node);
      }

      (node[row.p] = node[row.p] || []).push({
        value: row.o,
        direction: Direction.Outgoing,
      });

      if (row.endpointUrl) {
        const endpointIdStr = this.endpoints.getIdBySparqlUrl(row.endpointUrl);
        if (endpointIdStr) {
          const endpointIds: NodeObj[] = node.endpointId ?? [];
          const exists = endpointIds.some(
            (e: NodeObj) => e.value === endpointIdStr,
          );
          if (!exists) {
            endpointIds.push({
              value: endpointIdStr,
              direction: Direction.Outgoing,
            });
            node.endpointId = endpointIds;
          }
        }
      }
    }

    return Array.from(nodeMap.values());
  }
}
