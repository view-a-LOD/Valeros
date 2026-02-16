import { namespacePrefixes } from '../../default-settings/settings/namespace-prefixes.settings';

export const razuNamespacePrefixes: Record<string, string> = {
  ...namespacePrefixes,
  'http://www.nationaalarchief.nl/mdto-shacl#': 'mdto-sh:',
  'https://data.razu.nl/def/ldto/': 'ldto:',
  'https://data.razu.nl/razu/': 'razu:',
};
