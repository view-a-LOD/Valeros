import { AsWktComponent } from '../../../components/custom-render-components/by-predicate/as-wkt/asWkt.component';
import {
  RenderComponentsSettings,
  RenderMode,
} from '../../../models/settings/render-component-settings.type';
import { renderComponentSettings } from '../../default-settings/settings/render-component.settings';

export const hisgisRenderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [...renderComponentSettings[RenderMode.ByType]],
  [RenderMode.ByPredicate]: [
    ...renderComponentSettings[RenderMode.ByPredicate],
    {
      component: AsWktComponent,
      predicates: ['http://www.opengis.net/ont/geosparql#asWKT'],
    },
  ],
};
