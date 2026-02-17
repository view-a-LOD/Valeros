import { Module } from '@nestjs/common';

@Module({
  providers: [SparqlService],
  exports: [SparqlService],
})
export class SparqlModule {}
