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
import { SPARQLFilterOptionsProvider } from '../../services/search/filter-options-providers/sparql-filter-options.provider';
import { SPARQLSearchProvider } from '../../services/search/search-providers/sparql-search-provider/sparql-search.provider';
import { defaultSettings } from '../default-settings/default-settings';
import { renderComponentSettings } from '../default-settings/settings/render-component.settings';

export const gtmSettings: SettingsModel = {
  ...defaultSettings,
  endpoints: {
    ...defaultSettings.endpoints,
    data: {
      goudaTijdmachine: {
        label: 'Gouda Tijdmachine',
        endpointUrls: [
          { sparql: 'https://qlever.coret.org/gtm-geo-beeldbank' },
          { sparql: 'https://api.triplydb.com/datasets/none/sdo/sparql' },
          { sparql: 'https://api.triplydb.com/datasets/w3c/rdf/sparql' },
          { sparql: 'https://api.triplydb.com/datasets/w3c/rdfs/sparql' },
          { sparql: 'https://api.triplydb.com/datasets/ica/rico/sparql' },
        ],
      },
    },
    searchProvider: SPARQLSearchProvider,
  },
  content: {
    ...defaultSettings.content,
    translations: { basePath: './assets/i18n/gtm/', fileExtension: '.json' },
    // sparqlLanguageFilterForLiterals: ['nl', 'nl-nl'],
  },
  viewModes: {
    [ViewMode.List]: {
      ...defaultSettings.viewModes[ViewMode.List],
      [ViewModeSetting.ShowTypes]: false,
      [ViewModeSetting.ShowParents]: false,
    },
    [ViewMode.Grid]: {
      ...defaultSettings.viewModes[ViewMode.Grid],
      [ViewModeSetting.ShowTypes]: false,
      [ViewModeSetting.ShowParents]: false,
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
    filterOptionsProvider: SPARQLFilterOptionsProvider,
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
        [PredicateVisibility.SearchHits]: [
          {
            predicates: [
              'https://schema.org/creator',
              'https://schema.org/locationCreated',
            ],
          },
        ],
        [PredicateVisibility.Details]: [
          {
            predicates: [
              'https://schema.org/description',
              'https://schema.org/locationCreated',
              'https://schema.org/spatialCoverage',
              'https://schema.org/image',
              'https://schema.org/thumbnailUrl',
              '*',
            ],
          },
        ],
        [PredicateVisibility.Hide]: [{ predicates: [] }],
      },
      [ViewMode.Grid]: {
        [PredicateVisibility.SearchHits]: [],
        [PredicateVisibility.Details]: [],
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
    header: {
      ...defaultSettings.ui.header,
      logoPath: '/assets/img/gtm/logo.svg',
    },
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
