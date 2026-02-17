import type { Bindings } from '@comunica/types';
import { Literal, Term } from '@rdfjs/types';
import { PropertyValue, SearchResult } from '@valeros/shared/types';

export class SparqlNodeConverter {
  static convertResultsToNodes(
    bindings: Bindings[],
    endpoint: string,
  ): SearchResult[] {
    const nodeMap = new Map<string, SearchResult>();

    for (const binding of bindings) {
      const s = binding.get('s');
      const p = binding.get('p');
      const o = binding.get('o');

      if (!s || !p || !o) continue;

      const subjectUri = s.value;
      const predicate = p.value;

      let node = nodeMap.get(subjectUri);
      if (!node) {
        node = {
          id: subjectUri,
          endpointIds: [endpoint],
          properties: {},
        };
        nodeMap.set(subjectUri, node);
      }

      if (!node.properties[predicate]) {
        node.properties[predicate] = [];
      }

      node.properties[predicate].push(this.termToPropertyValue(o));
    }

    return Array.from(nodeMap.values());
  }

  static termToPropertyValue(term: Term): PropertyValue {
    const propertyValue: PropertyValue = {
      value: term.value,
      type: term.termType,
    };

    if (term.termType === 'Literal') {
      const literal = term as Literal;
      if (literal.language) {
        propertyValue.language = literal.language;
      }
      if (literal.direction) {
        propertyValue.direction = literal.direction;
      }
      if (
        literal.datatype &&
        literal.datatype.value !== 'http://www.w3.org/2001/XMLSchema#string'
      ) {
        propertyValue.datatype = literal.datatype.value;
      }
    }

    return propertyValue;
  }
}
