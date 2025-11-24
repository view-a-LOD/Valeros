import { FilteringSettings } from '../../../models/settings/filtering-settings.model';
import { defaultSettings } from '../../default-settings/default-settings';

export const hisgisFilteringSettings: FilteringSettings = {
  ...defaultSettings.filtering,
  filterOptions: {
    type: {
      label: 'Type',
      fieldIds: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type.keyword'],
      values: [],
      hideValueIds: [],
    },
  },
};
