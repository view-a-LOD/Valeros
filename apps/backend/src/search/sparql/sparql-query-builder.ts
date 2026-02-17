export class SparqlQueryBuilder {
  static buildSearchQuery(
    searchTerm: string,
    page: number,
    pageSize: number,
  ): string {
    const offset = page * pageSize;
    const filter = searchTerm
      ? `FILTER(CONTAINS(LCASE(STR(?o)), LCASE("${searchTerm}")))`
      : '';

    return `
      SELECT ?s ?p ?o
      WHERE {
        ?s ?p ?o .
        ${filter}
      }
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
  }
}
