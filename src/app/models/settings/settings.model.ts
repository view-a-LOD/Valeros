import { ClusteringSettings } from './clustering-settings.model';
import { ContentSettings } from './content-settings.model';
import { EndpointSettings } from './endpoint-settings.model';
import { FileRenderingSettings } from './file-rendering.settings.model';
import { FilteringSettings } from './filtering-settings.model';
import { IIIFSettings } from './iiif-settings.model';
import { MatomoSettings } from './matomo-settings.model';
import { NodeVisibilitySettings } from './node-visibility-settings.model';
import { PredicateSettings } from './predicate-settings.model';
import { PredicateVisibilitySettings } from './predicate-visibility-settings.model';
import { RenderComponentsSettings } from './render-component-settings.type';
import { SearchSettings } from './search-settings.model';
import { SortingSettings } from './sorting-settings.model';
import { UiSettings } from './ui-settings.model';
import { UrlSettings } from './url-settings.model';
import { ViewModeSettings } from './view-mode-settings.type';

export interface SettingsModel {
  endpoints: EndpointSettings;
  predicateVisibility: PredicateVisibilitySettings;
  /**
   * E.g. hide all nodes of type "skos:Concept", or only show nodes with a certain type
   */
  nodeVisibility: NodeVisibilitySettings;
  sorting: SortingSettings;
  filtering: FilteringSettings;
  clustering: ClusteringSettings;
  renderComponents: RenderComponentsSettings;
  /**
   * E.g. How are things displayed in list view, grid view, etc.
   */
  viewModes: ViewModeSettings;
  ui: UiSettings;
  content: ContentSettings;
  search: SearchSettings;
  iiif: IIIFSettings;
  namespacePrefixes: Record<string, string>;
  fileRendering: FileRenderingSettings;
  /**
   * E.g. what predicates are used for parents, labels, types, files, etc.
   */
  predicates: PredicateSettings;
  url: UrlSettings;
  matomo?: MatomoSettings;
}
