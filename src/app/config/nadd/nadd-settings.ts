import { PredicateVisibility } from '../../models/settings/predicate-visibility-settings.model';
import { SettingsModel } from '../../models/settings/settings.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { ViewMode } from '../../models/view-mode.enum';
import { defaultSettings } from '../default-settings/default-settings';

export const naddSettings: SettingsModel = defaultSettings;

// Show organizations filter
naddSettings.filtering = {
  ...defaultSettings.filtering,
  showOrganizationsFilter: true,
};

// Add endpoints
naddSettings.endpoints = {
  ...defaultSettings.endpoints,
  data: {
    haagsHistorischMuseum: {
      label: 'Haags Historisch Museum/Rijksmuseum De Gevangenpoort',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q11722011' }],
    },
    stichtingVanDerWyckDeKempenaer: {
      label: 'Stichting Van der Wyck-de Kempenaer',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q20829167' }],
    },
    museumMohlmann: {
      label: 'Museum Møhlmann',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q2168069' }],
    },
    mowMuseumWesterwolde: {
      label: 'MOW Museum Westerwolde',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q13612139' }],
    },
    museumAanDeA: {
      label: 'Museum aan de A',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q2004350' }],
    },
    keramiekMuseum: {
      label: 'Keramiekmuseum Tiendschuur',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q2022136' }],
    },
    discoveryMuseum: {
      label: 'Discovery Museum',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q110996022' }],
    },
    stichtingDesign: {
      label: 'Stichting Design en Kunst Openbare Ruimte (DKOR)',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q124789020' }],
    },
    nationaalBusMuseum: {
      label: 'Nationaal Bus Museum',
      endpointUrls: [{ sparql: 'https://sparql.ldmax.nl/q2575273' }],
    },
  },
};

// Replace default header with NADD header (logo without text)
naddSettings.ui = {
  ...defaultSettings.ui,
  header: {
    ...defaultSettings.ui.header,
    showTitle: false,
    logoPath: '/assets/img/nadd/logo.svg',
  },
};

// Hide many details on search hits page
naddSettings.predicateVisibility = {
  byViewMode: {
    [ViewMode.List]: {
      [PredicateVisibility.SearchHits]: [
        {
          predicates: [
            'https://schema.org/description',
            'https://schema.org/material',
            // '*',
          ],
        },
      ],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [{ predicates: [] }],
    },
    [ViewMode.Grid]: {
      [PredicateVisibility.SearchHits]: [],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
  },
  alwaysHide: [...defaultSettings.predicateVisibility.alwaysHide],
  hideTypeBadges: [],
};

// Add Schema and DC Terms endpoints (to automatically retrieve labels for predicates)
naddSettings.endpoints.data = {
  ...naddSettings.endpoints.data,
  schema: {
    label: 'Schema.org',
    endpointUrls: [
      { sparql: 'https://triplydb.com/_api/datasets/none/sdo/sparql' },
    ],
  },
  dcTerms: {
    label: 'DC Terms',
    endpointUrls: [
      { sparql: 'https://triplydb.com/_api/datasets/dcmi/dct/sparql' },
    ],
  },
};

// Show images for nodes
naddSettings.predicates = {
  ...defaultSettings.predicates,
  files: [
    'https://schema.org/associatedMedia',
    'https://schema.org/contentUrl',
  ],
  hopFiles: [
    ['https://schema.org/associatedMedia', 'https://schema.org/contentUrl'],
  ],
};

// Show organization for nodes
naddSettings.viewModes[ViewMode.List][ViewModeSetting.ShowOrganization] = true;
naddSettings.viewModes[ViewMode.Grid][ViewModeSetting.ShowOrganization] = true;

// Hide type for nodes
naddSettings.viewModes[ViewMode.List][ViewModeSetting.ShowTypes] = false;
naddSettings.viewModes[ViewMode.Grid][ViewModeSetting.ShowTypes] = false;

// Hide parents for nodes
naddSettings.viewModes[ViewMode.List][ViewModeSetting.ShowParents] = false;
naddSettings.viewModes[ViewMode.Grid][ViewModeSetting.ShowParents] = false;

// Show (placeholder) type filter, note that this does not work yet without Elasticsearch
naddSettings.filtering = {
  ...naddSettings.filtering,
  filterOptions: {
    type: {
      label: 'Type',
      fieldIds: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
      values: [],
    },
  },
};

// Add RDF and FOAF endpoints
naddSettings.endpoints.data['rdf'] = {
  label: 'RDF',
  endpointUrls: [
    { sparql: 'https://triplydb.com/_api/datasets/w3c/rdf/sparql' },
    { sparql: 'https://triplydb.com/_api/datasets/w3c/rdfs/sparql' },
  ],
};
naddSettings.endpoints.data['foaf'] = {
  label: 'FOAF',
  endpointUrls: [
    { sparql: 'https://triplydb.com/_api/datasets/none/foaf/sparql' },
  ],
};

naddSettings.endpoints.data['owl'] = {
  label: 'OWL',
  endpointUrls: [
    { sparql: 'https://triplydb.com/_api/datasets/w3c/owl/sparql' },
  ],
};

// naddSettings.nodeVisibility = {
//   ...defaultSettings.nodeVisibility,
//   // TODO: Implement SPARQL search provider support for this
//   alwaysHide: {
//     hideTerms: {
//       fieldIds: ['https://schema.org/inDefinedTermSet'],
//       valueIds: [],
//       type: FilterType.FieldAndValue,
//     },
//   },
// };
