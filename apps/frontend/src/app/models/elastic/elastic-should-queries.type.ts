import { ElasticFieldExistsQuery } from './elastic-field-exists-query.type';
import { ElasticFullTextMatchQuery } from './elastic-full-text-match-query.type';
import { ElasticMatchAllQuery } from './elastic-match-all-query.type';
import { ElasticMatchQueries } from './elastic-match-queries.type';
import { ElasticQuery } from './elastic-query.type';

export type ElasticShouldQueries = {
  bool: {
    should: (
      | ElasticMatchQueries
      | ElasticFieldExistsQuery
      | ElasticQuery
      | ElasticFullTextMatchQuery
      | ElasticShouldQueries
      | ElasticMatchAllQuery
    )[];
  };
};
