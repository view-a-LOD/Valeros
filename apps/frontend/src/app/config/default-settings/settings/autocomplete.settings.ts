import { AutocompleteSettings } from '../../../models/settings/autocomplete-settings.model';

export const autocompleteSettings: AutocompleteSettings = {
  enabled: false,
  maxAutocompleteOptionsPerEndpoint: 50,
  maxAutocompleteOptionsToShow: 20,
  filtersForAutocompleteOptions: {},
};

// Example:
// filtersForAutocompleteOptions: {
//   type: {
//     type: FilterType.FieldAndValue,
//     fieldIds: typePredicates,
//     valueIds: ['http://www.w3.org/2004/02/skos/core#Concept'],
//   },
//   parents: {
//     type: FilterType.FieldAndValue,
//     fieldIds: parentPredicates,
//     valueIds: ['https://termennetwerk.netwerkdigitaalerfgoed.nl'],
//   },
// },
