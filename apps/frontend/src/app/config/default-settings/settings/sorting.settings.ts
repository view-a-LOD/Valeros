import { SortOrder } from '../../../models/settings/sort-order.enum';
import { SortingSettings } from '../../../models/settings/sorting-settings.model';
import { labelPredicates } from './predicate.settings';

export const sortingSettings: SortingSettings = {
  default: 'relevance',
  options: {
    relevance: {
      fields: [],
      label: 'Relevantie',
      order: SortOrder.Ascending,
      boost: {},
    },
    'title-a-z': {
      fields: labelPredicates.map((pred) => pred + '.keyword'),
      label: 'Titel (A-Z)',
      order: SortOrder.Ascending,
    },
    'title-z-a': {
      fields: labelPredicates.map((pred) => pred + '.keyword'),
      label: 'Titel (Z-A)',
      order: SortOrder.Descending,
    },
  },
};
