import { SchemaGeoLatLongComponent } from '../../_custom-components/custom-render-components/by-predicate/schema-geo-lat-long/schema-geo-lat-long.component';
import { ExternalLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/external-link/external-link.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { HopLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { RenderMode } from '../../models/settings/render-component-settings.type';
import { SettingsModel } from '../../models/settings/settings.model';
import { defaultSettings } from '../default-settings/default-settings';
import { renderComponentSettings } from '../default-settings/settings/render-component.settings';

export const gtmSettings: SettingsModel = {
  ...defaultSettings,
  endpoints: {
    ...defaultSettings.endpoints,
    data: {
      goudaTimeMachine: {
        label: 'Gouda Time Machine',
        endpointUrls: [
          {
            sparql: 'https://qlever.coret.org/gtm-geo-beeldbank',
          },
        ],
      },
    },
  },
  filtering: {
    ...defaultSettings.filtering,
    filterOptions: {
      type: {
        label: 'Type',
        fieldIds: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
        values: [],
      },
      creator: {
        label: 'Creator',
        fieldIds: ['https://schema.org/creator'],
        values: [],
      },
    },
  },
  predicates: {
    ...defaultSettings.predicates,
    label: [
      ...defaultSettings.predicates.label,
      'https://schema.org/description',
    ],
  },
  namespacePrefixes: {
    ...defaultSettings.namespacePrefixes,
    'https://schema.org/': 'schema:',
  },
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
        component: HopLinkComponent,
        predicates: [
          'https://www.ica.org/standards/RiC/ontology#isAssociatedWithDate',
        ],
        hopLinkSettings: {
          preds: ['https://www.ica.org/standards/RiC/ontology#expressedDate'],
          showHops: true,
        },
      },
      {
        component: HopLinkComponent,
        predicates: [
          'https://www.ica.org/standards/RiC/ontology#hasBeginningDate',
          'https://www.ica.org/standards/RiC/ontology#hasEndDate',
        ],
        hopLinkSettings: {
          preds: [
            'https://www.ica.org/standards/RiC/ontology#normalizedDateValue',
          ],
          showHops: false,
        },
      },
      {
        component: SchemaGeoLatLongComponent,
        predicates: ['https://schema.org/locationCreated'],
      },
      {
        component: ExternalLinkComponent,
        predicates: ['https://schema.org/mainEntityOfPage'],
      },
    ],
  },
};
