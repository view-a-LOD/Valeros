export interface SparqlBinding {
  type: string;
  value: string;
}

export interface SparqlResult {
  s: SparqlBinding;
  p: SparqlBinding;
  o: SparqlBinding;
}

export class SparqlClient {
  static async executeQuery(
    endpoint: string,
    query: string,
  ): Promise<SparqlResult[]> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/sparql-results+json',
      },
      body: `query=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results?.bindings || [];
  }
}
