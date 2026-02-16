export type ElasticFullTextMatchQuery = {
  match: {
    _full_text: {
      query: string;
    };
  };
};
