import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Search for nodes',
    description: 'Search nodes by query string with pagination support',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query string',
    example: 'test',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (0-indexed)',
    example: 0,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of results per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns search results with nodes, total count, and capped flag',
  })
  search(
    @Query('query') query: string,
    @Query('page') page: string = '0',
    @Query('pageSize') pageSize: string = '10',
  ) {
    return this.searchService.searchNodes({
      query: query || '',
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      filters: [], // TODO: Accept filters from query params
    });
  }
}
