import { PredicateSettings } from '../../../models/settings/predicate-settings.model';

export const typePredicates: string[] = [
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'https://schema.org/additionalType',
];

export const labelPredicates: string[] = [
  'http://www.w3.org/2000/01/rdf-schema#label',
  'http://www.w3.org/2004/02/skos/core#prefLabel',
  'http://schema.org/name',
  'https://schema.org/name',
];

export const parentPredicates: string[] = ['https://schema.org/isPartOf'];

export const filePredicates: string[] = [
  'http://xmlns.com/foaf/0.1/depiction',
  'https://schema.org/image',
];

export const hopFilePredicates: string[][] = [];

export const predicateSettings: PredicateSettings = {
  parents: parentPredicates,
  label: labelPredicates,
  type: typePredicates,
  files: filePredicates,
  hopFiles: hopFilePredicates,
  fetchHopFilesOnSearchPage: true,
};
