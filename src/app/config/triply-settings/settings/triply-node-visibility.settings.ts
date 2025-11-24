import { FilterType } from '../../../models/filters/filter.model';
import { NodeVisibilitySettings } from '../../../models/settings/node-visibility-settings.model';
import { nodeVisibilitySettings } from '../../default-settings/settings/node-visibility.settings';
import { typePredicates } from '../../default-settings/settings/predicate.settings';

export const triplyNodeVisibilitySettings: NodeVisibilitySettings = {
  ...nodeVisibilitySettings,
  alwaysHide: {
    hideAudioObjects: {
      fieldIds: [...typePredicates],
      valueIds: ['http://schema.org/AudioObject'],
      type: FilterType.FieldAndValue,
    },
    hideTechnicalTypes: {
      fieldIds: [...typePredicates],
      valueIds: [
        'http://www.w3.org/ns/shacl#PropertyShape',
        'http://www.w3.org/ns/shacl#NodeShape',
        'http://www.w3.org/2002/07/owl#DatatypeProperty',
        'http://www.w3.org/2002/07/owl#ObjectProperty',
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property',
        'http://rdfs.org/ns/void#Dataset',
        'http://www.w3.org/2002/07/owl#Ontology',
        'http://purl.org/linked-data/cube',
        'http://www.w3.org/ns/sparql-service-description#Service',
      ],
      type: FilterType.FieldAndValue,
    },
  },
};
