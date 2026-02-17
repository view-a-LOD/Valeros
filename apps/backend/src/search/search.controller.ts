import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchRequest } from '@valeros/shared/types';
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
  @ApiQuery({
    name: 'endpoints',
    required: false,
    description: 'SPARQL endpoint URLs',
    example: 'http://example.org/sparql',
    isArray: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns search results with nodes, total count, and capped flag',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required parameters or endpoints',
  })
  async search(
    @Query('query') query: string,
    @Query('page') page: string = '0',
    @Query('pageSize') pageSize: string = '10',
    @Query('endpoints') endpoints?: string | string[],
  ) {
    const endpointUrls = endpoints
      ? Array.isArray(endpoints)
        ? endpoints
        : [endpoints]
      : [];

    const params: SearchRequest = {
      query: query || '',
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      filters: [], // TODO: Accept filters from query params
      endpoints: endpointUrls,
    };

    return this.searchService.searchNodes(params);
  }
}
