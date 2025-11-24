import { namespacePrefixes } from '../../default-settings/settings/namespace-prefixes.settings';

export const hisgisNamespacePrefixes: Record<string, string> = {
  ...namespacePrefixes,
  'https://hisgis.hualab.nl/id/': 'id:',
  'https://hisgis.hualab.nl/def/': '',
  'http://www.opengis.net/ont/geosparql#': 'geo:',
};
