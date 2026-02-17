export class SparqlQueryBuilder {
  static buildSearchQuery(
    searchTerm: string,
    page: number,
    pageSize: number,
    languages?: string[],
  ): string {
    // TODO: Implement pagination
    // const offset = page * pageSize;

    if (!searchTerm) {
      return `
        SELECT ?s ?p ?o
        WHERE {
          ?s ?p ?o .
          ${this.buildLanguageFilter(languages)}
        }
      `;
    }

    const searchFilter = searchTerm
      ? `FILTER(CONTAINS(LCASE(STR(?o)), LCASE("${searchTerm}")))`
      : '';

    const languageFilter = this.buildLanguageFilter(languages);

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
