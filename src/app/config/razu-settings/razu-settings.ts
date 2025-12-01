import { SettingsModel } from '../../models/settings/settings.model';
import { razuEndpointSettings } from './settings/endpoints/razu-endpoint.settings';
import { razuMatomoSettings } from './settings/matomo/razu-matomo.settings';
import { razuClusteringSettings } from './settings/razu-clustering.settings';
import { razuContentSettings } from './settings/razu-content.settings';
import { razuFileRenderingSettings } from './settings/razu-file-rendering.settings';
import { razuFilteringSettings } from './settings/razu-filtering.settings';
import { razuIIIFSettings } from './settings/razu-iiif.settings';
import { razuNamespacePrefixes } from './settings/razu-namespace-prefixes.settings';
import { razuNodeVisibilitySettings } from './settings/razu-node-visibility.settings';
import { razuPredicateVisibilitySettings } from './settings/razu-predicate-visibility.settings';
import { razuPredicateSettings } from './settings/razu-predicate.settings';
import { razuRenderComponentSettings } from './settings/razu-render-component.settings';
import { razuSearchSettings } from './settings/razu-search.settings';
import { razuSortingSettings } from './settings/razu-sorting.settings';
import { razuUiSettings } from './settings/razu-ui.settings';
import { razuUrlSettings } from './settings/razu-url.settings';
import { razuViewModeSettings } from './settings/razu-view-mode.settings';

export const razuSettings: SettingsModel = {
  endpoints: razuEndpointSettings,
  predicateVisibility: razuPredicateVisibilitySettings,
  nodeVisibility: razuNodeVisibilitySettings,
  sorting: razuSortingSettings,
  filtering: razuFilteringSettings,
  clustering: razuClusteringSettings,
  renderComponents: razuRenderComponentSettings,
  viewModes: razuViewModeSettings,
  ui: razuUiSettings,
  content: razuContentSettings,
  search: razuSearchSettings,
  iiif: razuIIIFSettings,
  namespacePrefixes: razuNamespacePrefixes,
  fileRendering: razuFileRenderingSettings,
  predicates: razuPredicateSettings,
  url: razuUrlSettings,
  matomo: razuMatomoSettings,
};
