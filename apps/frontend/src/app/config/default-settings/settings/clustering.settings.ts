import { ClusteringSettings } from '../../../models/settings/clustering-settings.model';

export const clusteringSettings: ClusteringSettings = {
  filterOptionValues: {},
  types: {},
};

// Example:
// filterOptionValues: {
//   locations: {
//     label: 'Locaties',
//     valueIds: [
//       'https://schema.org/Place',
//       'https://schema.org/PostalAddress',
//       'https://www.ica.org/standards/RiC/ontology#Place',
//       'https://data.razu.nl/def/ldto/dekkingInRuimte',
//       'http://www.opengis.net/ont/geosparql#Geometry',
//     ],
//   },
// }

// Example:
// types: {
//   recordSet: {
//     label: 'RecordSet',
//     valueIds: [
//       'https://www.ica.org/standards/RiC/ontology#RecordSet',
//       'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#File',
//     ],
//   },
// },
