import { SearchSettings } from '../../../models/settings/search-settings.model';
import { searchSettings } from '../../default-settings/settings/search.settings';
import { razuAutocompleteSettings } from './razu-autocomplete.settings';

export const razuSearchSettings: SearchSettings = {
  ...searchSettings,
  autocomplete: razuAutocompleteSettings,
  preventReplacingPeriodWithSpaceForElasticSuffixes: [
    '.keyword',
    '.text',
    '.uri',
    '.label',
    '.raw',
  ],
};
