export class SparqlQueryBuilder {
  static buildSearchQuery(
    searchTerm: string,
    page: number,
    pageSize: number,
  ): string {
    // TODO: Implement pagination
    // const offset = page * pageSize;

    if (!searchTerm) {
      return `
        SELECT ?s ?p ?o
        WHERE {
          ?s ?p ?o .
        }
      `;
    }

    const filter = searchTerm
      ? `FILTER(CONTAINS(LCASE(STR(?o)), LCASE("${searchTerm}")))`
      : '';

    return `
        SELECT ?s ?p ?o
        WHERE {
          {
            SELECT DISTINCT ?s
            WHERE {
              ?s ?p ?o .
              ${filter}
            }
          }
          ?s ?p ?o .
        }
      `;
  }
}
