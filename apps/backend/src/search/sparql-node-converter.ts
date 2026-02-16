import { Direction, NodeModel } from '@valeros/shared/types';
import { SparqlResult } from './sparql-client';

export class SparqlNodeConverter {
  static convertResultsToNodes(
    results: SparqlResult[],
    endpoint: string,
  ): NodeModel[] {
    const nodeMap = new Map<string, NodeModel>();

    for (const result of results) {
      const subjectUri = result.s.value;
      const predicate = result.p.value;
      const objectValue = result.o.value;

      let node = nodeMap.get(subjectUri);
      if (!node) {
        node = {
          '@id': [{ value: subjectUri, direction: Direction.Outgoing }],
          endpointId: [{ value: endpoint, direction: Direction.Outgoing }],
        };
        nodeMap.set(subjectUri, node);
      }

      if (!node[predicate]) {
        node[predicate] = [];
      }

      node[predicate].push({
        value: objectValue,
        direction: Direction.Outgoing,
      });
    }

    return Array.from(nodeMap.values());
  }
}
