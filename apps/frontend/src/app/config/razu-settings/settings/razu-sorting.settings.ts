import { SortOrder } from '../../../models/settings/sort-order.enum';
import { SortingSettings } from '../../../models/settings/sorting-settings.model';
import { sortingSettings } from '../../default-settings/settings/sorting.settings';

export const razuSortingSettings: SortingSettings = {
  ...sortingSettings,
  options: {
    ...sortingSettings.options,
    'title-a-z': {
      fields: ['naam.keyword'],
      label: 'Titel (A-Z)',
      order: SortOrder.Ascending,
    },
    'title-z-a': {
      fields: ['naam.keyword'],
      label: 'Titel (Z-A)',
      order: SortOrder.Descending,
    },
    'date-asc': {
      fields: ['document_day'],
      label: 'Datum (oudste eerst)',
      order: SortOrder.Ascending,
    },
    'date-desc': {
      fields: ['document_day'],
      label: 'Datum (nieuwste eerst)',
      order: SortOrder.Descending,
    },
  },
};
