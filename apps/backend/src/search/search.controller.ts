import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('query') query: string,
    @Query('page') page: string = '0',
    @Query('pageSize') pageSize: string = '10',
  ) {
    return this.searchService.searchNodes({
      query: query || '',
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
    });
  }
}
