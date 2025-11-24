import { namespacePrefixes } from '../../default-settings/settings/namespace-prefixes.settings';

export const hisgisNamespacePrefixes: Record<string, string> = {
  ...namespacePrefixes,
  'https://hisgis.hualab.nl/id/': 'id:',
  'http://www.opengis.net/ont/geosparql#': 'geo:',
};
