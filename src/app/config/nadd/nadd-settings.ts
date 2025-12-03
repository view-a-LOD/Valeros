import { FilterType } from '../../models/filters/filter.model';
import { PredicateVisibility } from '../../models/settings/predicate-visibility-settings.model';
import { SettingsModel } from '../../models/settings/settings.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { ViewMode } from '../../models/view-mode.enum';
import { defaultSettings } from '../default-settings/default-settings';

export const naddSettings: SettingsModel = {
  ...defaultSettings,
  endpoints: {
    ...defaultSettings.endpoints,
    data: {
      haagsHistorischMuseum: {
        label: 'Haags Historisch Museum/Rijksmuseum De Gevangenpoort',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q11722011',
          },
        ],
      },
      stichtingVanDerWyckDeKempenaer: {
        label: 'Stichting Van der Wyck-de Kempenaer',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q20829167',
          },
        ],
      },
      museumMohlmann: {
        label: 'Museum Møhlmann',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q2168069',
          },
        ],
      },
      mowMuseumWesterwolde: {
        label: 'MOW Museum Westerwolde',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q13612139',
          },
        ],
      },
      museumAanDeA: {
        label: 'Museum aan de A',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q2004350',
          },
        ],
      },
      keramiekMuseum: {
        label: 'Keramiekmuseum Tiendschuur',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q2022136',
          },
        ],
      },
      discoveryMuseum: {
        label: 'Discovery Museum',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q110996022',
          },
        ],
      },
      stichtingDesign: {
        label: 'Stichting Design en Kunst Openbare Ruimte (DKOR)',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q124789020',
          },
        ],
      },
      nationaalBusMuseum: {
        label: 'Nationaal Bus Museum',
        endpointUrls: [
          {
            sparql: 'https://sparql.ldmax.nl/q2575273',
          },
        ],
      },
    },
  },
  viewModes: {
    [ViewMode.List]: {
      ...defaultSettings.viewModes[ViewMode.List],
      [ViewModeSetting.ShowTypes]: false,
      [ViewModeSetting.ShowOrganization]: true,
    },
    [ViewMode.Grid]: {
      ...defaultSettings.viewModes[ViewMode.Grid],
      [ViewModeSetting.ShowTypes]: false,
      [ViewModeSetting.ShowOrganization]: true,
    },
  },
  predicateVisibility: {
    byViewMode: {
      [ViewMode.List]: {
        [PredicateVisibility.Show]: [
          {
            predicates: [
              'https://schema.org/description',
              'https://schema.org/material',
              // '*',
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
  filtering: {
    ...defaultSettings.filtering,
    showOrganizationsFilter: true,
    filterOptions: {
      type: {
        label: 'Type',
        fieldIds: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
        values: [],
      },
    },
  },
  predicates: {
    ...defaultSettings.predicates,
    files: [
      'https://schema.org/associatedMedia',
      'https://schema.org/contentUrl',
    ],
    hopFiles: [
      ['https://schema.org/associatedMedia', 'https://schema.org/contentUrl'],
    ],
  },
  nodeVisibility: {
    ...defaultSettings.nodeVisibility,
    // TODO: Implement SPARQL search provider support for this
    alwaysHide: {
      hideTerms: {
        fieldIds: ['https://schema.org/inDefinedTermSet'],
        valueIds: [],
        type: FilterType.FieldAndValue,
      },
    },
  },
};
