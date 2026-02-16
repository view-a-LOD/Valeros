import { FilterType } from '../../../models/filters/filter.model';
import { NodeVisibilitySettings } from '../../../models/settings/node-visibility-settings.model';
import { nodeVisibilitySettings } from '../../default-settings/settings/node-visibility.settings';
import {
  parentPredicates,
  typePredicates,
} from '../../default-settings/settings/predicate.settings';

export const razuNodeVisibilitySettings: NodeVisibilitySettings = {
  ...nodeVisibilitySettings,
  onlyShow: {
    // TODO: There might be a bug here, meaning this functionality might not work as expected
    // onlyShowInformatieObject: {
    //   fieldIds: [...typePredicates],
    //   valueIds: ['https://data.razu.nl/def/ldto/Informatieobject'],
    //   type: FilterType.FieldAndValue,
    // },
  },
  alwaysHide: {
    hideSkosConcept: {
      fieldIds: [...typePredicates],
      valueIds: ['http://www.w3.org/2004/02/skos/core#concept'],
      type: FilterType.FieldAndValue,
    },
    hideTerms: {
      fieldIds: [...parentPredicates],
      valueIds: [
        // 'https://hetutrechtsarchief.nl/id/trefwoorden',
        'https://termennetwerk.netwerkdigitaalerfgoed.nl',
      ],
      type: FilterType.FieldAndValue,
    },
  },
};
