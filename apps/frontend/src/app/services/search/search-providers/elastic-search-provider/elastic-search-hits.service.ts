import { Injectable } from '@angular/core';
import type { estypes } from '@elastic/elasticsearch';
import { ElasticEndpointSearchResponse } from '../../../../models/elastic/elastic-endpoint-search-response.type';
import { ElasticNodeModel } from '../../../../models/elastic/elastic-node.model';
import { Direction, NodeModel } from '../../../../models/node.model';
import { DataService } from '../../../data.service';

@Injectable({
  providedIn: 'root',
})
export class ElasticSearchHitsService {
  constructor(private data: DataService) {}

  parseToNodes(hits: estypes.SearchHit<ElasticNodeModel>[]): NodeModel[] {
    return hits
      .sort((a, b) => {
        return (a._source as any)?.['_score'] - (b._source as any)?.['_score'];
      })
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is ElasticNodeModel => !!hitNode)
      .map((hitNode) => {
        const node: NodeModel = {
          '@id': [],
          endpointId: [],
        };
        this.data.replaceElasticNodePredSpacesWithPeriods(hitNode);
        for (const [pred, obj] of Object.entries(hitNode)) {
          if (!(pred in node)) {
            node[pred] = [];
          }

          let objValue: string | string[] = obj;

          // TODO: Allow configuration of which field to use as URI if the obj is an object instead of a string
          const hasUriField =
            typeof obj === 'object' && obj !== null && 'uri' in obj;
          if (hasUriField) {
            objValue = obj.uri as string;
          }

          const objValuesAsArray = Array.isArray(objValue)
            ? objValue
            : [objValue];
          for (const value of objValuesAsArray) {
            node[pred].push({ value: value, direction: Direction.Outgoing });
          }
        }
        return node;
      });
  }

  getFromSearchResponses(
    searchResponses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ): estypes.SearchHit<ElasticNodeModel>[] {
    // First create a map of hits by their ID to merge duplicates
    const hitsMap = new Map<string, estypes.SearchHit<ElasticNodeModel>>();

    searchResponses.forEach((searchResponse) => {
      const hits = searchResponse?.hits?.hits ?? [];
      hits.forEach((hit) => {
        if (!hit._source) {
          return;
        }

        // Add endpointId to the source
        (hit._source as ElasticNodeModel)['endpointId'] =
          searchResponse.endpointId;

        const id = hit._source['@id'];
        if (!id) {
          return;
        }

        if (hitsMap.has(id)) {
          // Merge the sources if we already have this ID
          const existingHit = hitsMap.get(id)!;
          if (!existingHit._source) {
            return;
          }

          const mergedSource: ElasticNodeModel = {
            ...existingHit._source,
            ...hit._source,
            // Keep track of all endpoints this record came from
            endpointId: Array.isArray((existingHit._source as any).endpointId)
              ? [
                  ...(existingHit._source as any).endpointId,
                  searchResponse.endpointId,
                ]
              : [
                  (existingHit._source as any).endpointId,
                  searchResponse.endpointId,
                ],
          };

          existingHit._source = mergedSource;
          // Use the highest score if available
          existingHit._score = Math.max(
            existingHit._score ?? 0,
            hit._score ?? 0,
          );
        } else {
          // New ID, just add it to the map
          hitsMap.set(id, hit);
        }
      });
    });

    // Convert map back to array
    return Array.from(hitsMap.values());
  }
}
