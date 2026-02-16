import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NodeModel } from '../../../../models/node.model';
import {
  SearchProvider,
  SearchRequest,
  SearchResponse,
} from '../search-provider.interface';

@Injectable({ providedIn: 'root' })
export class BackendSearchProvider extends SearchProvider {
  private readonly apiUrl = 'http://localhost:3000/api/search';

  constructor(private http: HttpClient) {
    super();
  }

  async searchNodes(request: SearchRequest): Promise<SearchResponse> {
    const params = {
      query: request.query || '',
      page: request.page.toString(),
      pageSize: request.pageSize.toString(),
    };

    try {
      const response = await firstValueFrom(
        this.http.get<SearchResponse>(this.apiUrl, { params }),
      );

      return response;
    } catch (error) {
      console.error('Backend search failed:', error);
      return { nodes: [], total: 0, isCapped: false };
    }
  }
}
