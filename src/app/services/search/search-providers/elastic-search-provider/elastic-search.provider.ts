import { Injectable } from '@angular/core';
import type { estypes } from '@elastic/elasticsearch';

import { ElasticEndpointSearchResponse } from '../../../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticNodeModel } from '../../../../models/elastic/elastic-node.model';
import { NodeModel } from '../../../../models/node.model';
import {
  SearchProvider,
  SearchRequest,
  SearchResponse,
} from '../search-provider.interface';
import { ElasticSearchHitsService } from './elastic-search-hits.service';
import { ElasticService } from './elastic.service';

@Injectable({
  providedIn: 'root',
})
export class ElasticSearchProvider extends SearchProvider {
  constructor(
    private elastic: ElasticService,
    private hits: ElasticSearchHitsService,
  ) {
    super();
  }

  private _calculateTotalHits(
    responses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ): { total: number; isCapped: boolean } {
    let isCapped = false;
    const total = responses.reduce((acc, response) => {
      const hitTotal = response.hits.total;
      if (typeof hitTotal === 'number') {
        return acc + hitTotal;
      } else if (hitTotal && typeof hitTotal === 'object') {
        if (hitTotal.relation !== 'eq') {
          isCapped = true;
        }
        return acc + hitTotal.value;
      }
      return acc;
    }, 0);
    return { total, isCapped };
  }

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const from = request.page * request.pageSize;
    const size = request.pageSize;

    const responses = await this.elastic.searchNodes(
      request.query,
      from,
      size,
      request.filters,
    );

    const hits: estypes.SearchHit<ElasticNodeModel>[] =
      this.hits.getFromSearchResponses(responses);

    const nodes: NodeModel[] = this.hits.parseToNodes(hits);
    const { total, isCapped } = this._calculateTotalHits(responses);

    return {
      nodes,
      total,
      isCapped,
    };
  }
}
