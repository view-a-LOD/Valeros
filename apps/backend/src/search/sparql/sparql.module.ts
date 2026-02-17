import { Module } from '@nestjs/common';
import { SparqlService } from './sparql.service';

@Module({
  providers: [SparqlService],
  exports: [SparqlService],
})
export class SparqlModule {}
