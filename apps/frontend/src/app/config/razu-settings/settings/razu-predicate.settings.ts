import { PredicateSettings } from '../../../models/settings/predicate-settings.model';
import {
  filePredicates,
  labelPredicates,
  parentPredicates,
  typePredicates,
} from '../../default-settings/settings/predicate.settings';

export const razuTypePredicates: string[] = [
  ...typePredicates,
  'https://data.razu.nl/def/ldto/classificatie',
];

export const razuLabelPredicates: string[] = [
  ...labelPredicates,
  'naam',
  'https://data.razu.nl/def/ldto/naam',
  'https://data.razu.nl/def/ldto/begripLabel',
  'https://data.razu.nl/def/ldto/verwijzingNaam',
  'https://data.razu.nl/def/ldto/identificatieKenmerk',
  'http://www.w3.org/2004/02/skos/core#prefLabel',
];

export const razuParentPredicates: string[] = [
  ...parentPredicates,
  'https://data.razu.nl/def/ldto/isOnderdeelVan',
  'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
  'https://schema.org/hadPrimarySource',
];

export const razuFilePredicates: string[] = [...filePredicates, 'bestand_url'];

export const razuHopFilePredicates: string[][] = [
  [
    'https://data.razu.nl/def/ldto/heeftRepresentatie',
    'https://data.razu.nl/def/ldto/URLBestand',
  ],
];

export const razuPredicateSettings: PredicateSettings = {
  parents: razuParentPredicates,
  label: razuLabelPredicates,
  type: razuTypePredicates,
  files: razuFilePredicates,
  hopFiles: razuHopFilePredicates,
};
