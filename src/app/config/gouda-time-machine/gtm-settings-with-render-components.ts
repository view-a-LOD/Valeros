import { RicoDateComponent } from '../../_custom-components/custom-render-components/by-predicate/rico-date/rico-date.component';
import { SchemaGeoComponent } from '../../_custom-components/custom-render-components/by-predicate/schema-geo/schema-geo.component';
import { ExternalLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/external-link/external-link.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { RenderMode } from '../../models/settings/render-component-settings.type';
import { SettingsModel } from '../../models/settings/settings.model';
import { renderComponentSettings } from '../default-settings/settings/render-component.settings';
import { gtmBasicSettings } from './gtm-basic-settings';

export const gtmSettingsWithRenderComponents: SettingsModel = {
  ...gtmBasicSettings,
  renderComponents: {
    [RenderMode.ByType]: [...renderComponentSettings[RenderMode.ByType]],
    [RenderMode.ByPredicate]: [
      ...renderComponentSettings[RenderMode.ByPredicate],
      {
        component: FileRendererComponent,
        predicates: [
          'https://schema.org/image',
          'https://schema.org/thumbnailUrl',
        ],
        requiresExplicitRendering: true,
      },
      {
        component: RicoDateComponent,
        predicates: [
          'https://www.ica.org/standards/RiC/ontology#isAssociatedWithDate',
        ],
      },
      // {
      //   component: HopLinkComponent,
      //   predicates: [
      //     'https://www.ica.org/standards/RiC/ontology#hasBeginningDate',
      //     'https://www.ica.org/standards/RiC/ontology#hasEndDate',
      //   ],
      //   hopLinkSettings: {
      //     preds: [
      //       'https://www.ica.org/standards/RiC/ontology#normalizedDateValue',
      //     ],
      //     showHops: true,
      //   },
      // },
      {
        component: SchemaGeoComponent,
        predicates: [
          'https://schema.org/locationCreated',
          'https://schema.org/spatialCoverage',
        ],
      },
      {
        component: ExternalLinkComponent,
        predicates: ['https://schema.org/mainEntityOfPage'],
      },
    ],
  },
};
