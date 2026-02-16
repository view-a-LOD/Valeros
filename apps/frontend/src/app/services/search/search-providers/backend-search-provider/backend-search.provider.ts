import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchRequest, SearchResponse } from '@valeros/shared/types';
import { firstValueFrom } from 'rxjs';
import { SearchProvider } from '../search-provider.interface';

@Injectable({ providedIn: 'root' })
export class BackendSearchProvider extends SearchProvider {
  private readonly apiUrl = 'http://localhost:3000/api/search';

  constructor(private http: HttpClient) {
    super();
  }

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    try {
      const requestWithEndpoints: SearchRequest = {
        ...request,
        endpoints: [
          'https://sparql.ldmax.nl/q11722011',
          'https://sparql.ldmax.nl/q110996022',
        ],
      };

      const response = await firstValueFrom(
        this.http.get<SearchResponse>(this.apiUrl, {
          params: { ...requestWithEndpoints } as any,
        }),
      );

      return response;
    } catch (error) {
      console.error('Backend search failed:', error);
      return { nodes: [], total: 0, isCapped: false };
    }
  }
}
