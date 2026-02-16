export interface SparqlBindingTerm {
  type: string;
  value: string;
  'xml:lang'?: string;
  datatype?: string;
  [key: string]: unknown;
}

export type SparqlBindingRow = Record<string, SparqlBindingTerm>;

export interface SparqlResultsJson {
  head?: {
    vars?: string[];
    [key: string]: unknown;
  };
  results: {
    bindings: SparqlBindingRow[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type SparqlFlatRow = Record<string, string>;

export const hasSparqlResults = (
  response: unknown,
): response is SparqlResultsJson => {
  return (
    !!response &&
    typeof response === 'object' &&
    'results' in response &&
    Array.isArray((response as any).results?.bindings)
  );
};
