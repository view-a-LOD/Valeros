import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SparqlSearchService } from './sparql-search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, SparqlSearchService],
})
export class SearchModule {}
