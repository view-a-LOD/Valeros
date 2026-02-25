import { SingleEndpointQueryModel } from '@valeros/shared/types';

export class SparqlQueryBuilder {
  static buildSearchQuery(query: SingleEndpointQueryModel): string {
    // TODO: Implement pagination

    if (!query.query) {
      const emptyQuery = `
        SELECT ?s ?p ?o
        WHERE {
          ?s ?p ?o .
          ${this.buildLanguageFilter(query.languages)}
        }
      `;
      return emptyQuery;
    }

    const searchFilter = this.buildSearchFilter(query.query);
    const languageFilter = this.buildLanguageFilter(query.languages);

    return `
        SELECT ?s ?p ?o
        WHERE {
          {
            SELECT DISTINCT ?s
            WHERE {
              ?s ?p ?o .
              ${searchFilter}
              ${languageFilter}
            }
          }
          ?s ?p ?o .
          ${languageFilter}
        }
      `;
  }

  private static buildSearchFilter(searchTerm: string): string {
    return searchTerm
      ? `FILTER(CONTAINS(LCASE(STR(?o)), LCASE("${searchTerm}")))`
      : '';
  }

  private static buildLanguageFilter(languages?: string[]): string {
    if (!languages || languages.length === 0) {
      return '';
    }

    const langConditions = languages
      .map((lang) => `LANG(?o) = "${lang}" || LANGMATCHES(LANG(?o), "${lang}")`)
      .join(' || ');

    return `FILTER(!isLiteral(?o) || LANG(?o) = "" || ${langConditions})`;
  }
}
