import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SparqlModule } from './sparql/sparql.module';

@Module({
  imports: [SparqlModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
