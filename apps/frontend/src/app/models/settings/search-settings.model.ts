import { AutocompleteSettings } from './autocomplete-settings.model';

export interface SearchSettings {
  resultsPerPagePerEndpoint: number;
  /**
   * Used for counting filter option hits (e.g. if there are more than 100 "public domain" values found for the "license" filter, show "100+").
   * Max by default is 100 for elastic, tweak index.max_inner_result_window to go higher
   */
  elasticFilterTopHitsMax: number;
  autocomplete: AutocompleteSettings;
  /**
   * By default, periods of predicates/fields are replaced by spaces. This setting allows to define elastic suffixes that should keep their periods. E.g., .keyword for elastic types, or .uri for accessing an object's URI.
   */
  preventReplacingPeriodWithSpaceForElasticSuffixes: string[];
}
