import type { Bindings } from '@comunica/types';
import { Literal, Term } from '@rdfjs/types';
import { PropertyValue, SearchResult } from '@valeros/shared/types';

export class SparqlNodeConverter {
  static convertBindingsToSearchResults(
    bindings: Bindings[],
    endpointId: string,
  ): SearchResult[] {
    const resultMap = new Map<string, SearchResult>();

    for (const binding of bindings) {
      const s = binding.get('s');
      const p = binding.get('p');
      const o = binding.get('o');

      if (!s || !p || !o) continue;

      const subjectUri: string = s.value;
      const predicate: string = p.value;

      let searchResult: SearchResult | undefined = resultMap.get(subjectUri);
      if (!searchResult) {
        searchResult = {
          id: subjectUri,
          endpointIds: [endpointId],
          properties: {},
        };
        resultMap.set(subjectUri, searchResult);
      }

      if (!searchResult.properties[predicate]) {
        searchResult.properties[predicate] = [];
      }

      const propertyValue: PropertyValue = this.termToPropertyValue(o);
      searchResult.properties[predicate].push(propertyValue);
    }

    const nodeResults: SearchResult[] = Array.from(resultMap.values());
    return nodeResults;
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
