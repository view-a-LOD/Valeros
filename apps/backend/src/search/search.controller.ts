import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchQueryModel } from '@valeros/shared/types';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({
    summary: 'Search for nodes',
    description: 'Search nodes using SPARQL endpoints',
  })
  @ApiBody({
    description: 'Search query parameters',
    // TODO: Add schema from model
    examples: {
      basic: {
        summary: 'Basic search',
        value: {
          query: 'iris',
          page: 0,
          pageSize: 20,
          endpoints: [
            {
              type: 'sparql',
              url: 'https://api.triplydb.com/datasets/academy/pokemon/sparql',
            },
            {
              type: 'sparql',
              url: 'https://api.triplydb.com/datasets/Triply/iris/sparql',
            },
          ],
          filters: [],
          sorting: {
            predicates: ['dc:title', 'rdfs:label'],
            direction: 'asc',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns search results',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid search query',
  })
  async search(@Body() searchQuery: SearchQueryModel) {
    return this.searchService.searchNodes(searchQuery);
  }
}
