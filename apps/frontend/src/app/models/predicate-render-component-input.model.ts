import { HopLinkSettings } from './settings/hop-link-settings.model';

export interface PredicateRenderComponentInput {
  value: string;
  nodeId?: string;
  hopLinkSettings?: HopLinkSettings;
}
