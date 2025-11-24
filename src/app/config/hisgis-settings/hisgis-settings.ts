import { SettingsModel } from '../../models/settings/settings.model';
import { defaultSettings } from '../default-settings/default-settings';
import { hisgisEndpointSettings } from './settings/hisgis-endpoint.settings';
import { hisgisFilteringSettings } from './settings/hisgis-filtering.settings';
import { hisgisNamespacePrefixes } from './settings/hisgis-namespace-prefixes.settings';
import { hisgisNodeVisibilitySettings } from './settings/hisgis-node-visibility.settings';
import { hisgisPredicateVisibilitySettings } from './settings/hisgis-predicate-visibility.settings';
import { hisgisRenderComponentSettings } from './settings/hisgis-render-component.settings';
import { hisgisUiSettings } from './settings/hisgis-ui.settings';

export const hisgisSettings: SettingsModel = {
  ...defaultSettings,
  endpoints: hisgisEndpointSettings,
  filtering: hisgisFilteringSettings,
  namespacePrefixes: hisgisNamespacePrefixes,
  nodeVisibility: hisgisNodeVisibilitySettings,
  renderComponents: hisgisRenderComponentSettings,
  predicateVisibility: hisgisPredicateVisibilitySettings,
  ui: hisgisUiSettings,
};
