import { namespacePrefixes } from '../../default-settings/settings/namespace-prefixes.settings';

export const triplyNamespacePrefixes: Record<string, string> = {
  ...namespacePrefixes,
  'https://triplydb.com/academy/pokemon/vocab/': 'pokemon:',
  'https://triplydb.com/academy/pokemon/id/pokemon/': 'pokemon-id:',
};
