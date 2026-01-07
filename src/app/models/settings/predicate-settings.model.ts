export interface PredicateSettings {
  parents: string[];
  label: string[];
  type: string[];
  /**
   * This setting determines which predicates are used to consider node values to be files.
   * This is used to show a file (e.g. image, PDF, ...) preview next to the node table (if it's a renderable file type).
   */
  files: string[];
  /**
   * Sometimes, node files are not directly linked to the node, but a number of hops away.
   * This setting makes the hops (in sequential order) to find the files.
   * This is used to show a file (e.g. image, PDF, ...) preview next to the node table (if it's a renderable file type).
   */
  hopFiles: string[][];
  /**
   * If enabled, additional SPARQL queries are executed on the search page to follow `hopFiles`
   * and enrich search hits with files that are a number of hops away.
   */
  fetchHopFilesOnSearchPage: boolean;
}
