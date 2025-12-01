import { SettingsModel } from '../../models/settings/settings.model';
import { clusteringSettings } from './settings/clustering.settings';
import { contentSettings } from './settings/content.settings';
import { endpointSettings } from './settings/endpoint.settings';
import { fileRenderingSettings } from './settings/file-rendering.settings';
import { filteringSettings } from './settings/filtering.settings';
import { iiifSettings } from './settings/iiif.settings';
import { matomoSettings } from './settings/matomo.settings';
import { namespacePrefixes } from './settings/namespace-prefixes.settings';
import { nodeVisibilitySettings } from './settings/node-visibility.settings';
import { predicateVisibilitySettings } from './settings/predicate-visibility.settings';
import { predicateSettings } from './settings/predicate.settings';
import { renderComponentSettings } from './settings/render-component.settings';
import { searchSettings } from './settings/search.settings';
import { sortingSettings } from './settings/sorting.settings';
import { uiSettings } from './settings/ui.settings';
import { urlSettings } from './settings/url.settings';
import { viewModeSettings } from './settings/view-mode.settings';

export const defaultSettings: SettingsModel = {
  endpoints: endpointSettings,
  predicateVisibility: predicateVisibilitySettings,
  nodeVisibility: nodeVisibilitySettings,
  sorting: sortingSettings,
  filtering: filteringSettings,
  clustering: clusteringSettings,
  renderComponents: renderComponentSettings,
  viewModes: viewModeSettings,
  ui: uiSettings,
  content: contentSettings,
  search: searchSettings,
  iiif: iiifSettings,
  namespacePrefixes: namespacePrefixes,
  fileRendering: fileRenderingSettings,
  predicates: predicateSettings,
  url: urlSettings,
  matomo: matomoSettings,
};
