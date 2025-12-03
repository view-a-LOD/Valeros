import { RicoDateComponent } from '../../_custom-components/custom-render-components/by-predicate/rico-date/rico-date.component';
import { SchemaGeoComponent } from '../../_custom-components/custom-render-components/by-predicate/schema-geo/schema-geo.component';
import { ExternalLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/external-link/external-link.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { HopLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateVisibility } from '../../models/settings/predicate-visibility-settings.model';
import { RenderMode } from '../../models/settings/render-component-settings.type';
import { SettingsModel } from '../../models/settings/settings.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { ViewMode } from '../../models/view-mode.enum';
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
  viewModes: {
    [ViewMode.List]: {
      ...defaultSettings.viewModes[ViewMode.List],
      [ViewModeSetting.ShowTypes]: false,
    },
    [ViewMode.Grid]: {
      ...defaultSettings.viewModes[ViewMode.Grid],
      [ViewModeSetting.ShowTypes]: false,
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
  predicateVisibility: {
    byViewMode: {
      [ViewMode.List]: {
        [PredicateVisibility.Show]: [
          {
            predicates: [
              'https://schema.org/creator',
              'https://schema.org/locationCreated',
            ],
          },
        ],
        [PredicateVisibility.Details]: [
          {
            predicates: ['*'],
          },
        ],
        [PredicateVisibility.Hide]: [
          {
            predicates: [],
          },
        ],
      },
      [ViewMode.Grid]: {
        [PredicateVisibility.Show]: [],
        [PredicateVisibility.Details]: [{ predicates: ['*'] }],
        [PredicateVisibility.Hide]: [],
      },
    },
    alwaysHide: [...defaultSettings.predicateVisibility.alwaysHide],
    hideTypeBadges: [],
  },
  namespacePrefixes: {
    ...defaultSettings.namespacePrefixes,
    'https://schema.org/': 'sdo:',
  },
  ui: {
    ...defaultSettings.ui,
    labelMaxChars: 400,
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
        component: RicoDateComponent,
        predicates: [
          'https://www.ica.org/standards/RiC/ontology#isAssociatedWithDate',
        ],
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
