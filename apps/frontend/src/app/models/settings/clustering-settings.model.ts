import { ClusterValuesSettings } from './cluster-values-settings.model';

export interface ClusteringSettings {
  /**
   * If you notice that multiple filter option values refer to the same (or a similar) thing, you might want to show them as a single value, to streamline the user experience.
   * As an example, if you use multiple ontologies and create a filter for node types, there might be multiple values (e.g. sdo:Place, rico:Place, etc.) that refer to the "Location" of a node, which could be clustered into a single "Location" value.
   * Note that enabling this feature might have a (serious) performance impact depending on the number of filters, as we need to retrieve the hit IDs for each filter option value to check if we need to cluster them.
   */
  filterOptionValues: ClusterValuesSettings;
  /**
   * If you notice that multiple type IRIs refer to the same (or a similar) thing, you might want to show them as a (clustered) single type, to streamline the user experience.
   */
  // TODO: Add example
  types: ClusterValuesSettings;
}
