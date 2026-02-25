import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  SearchQueryModel,
  SearchResponseModel,
} from '@valeros/shared/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = 'Frontend Test - Home';
  searchResponse = signal<SearchResponseModel | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  query = signal('iris');
  endpoints = signal([
    {
      id: 'pokemon',
      url: 'https://api.triplydb.com/datasets/academy/pokemon/sparql',
    },
    { id: 'iris', url: 'https://api.triplydb.com/datasets/Triply/iris/sparql' },
  ]);

  constructor(private http: HttpClient) {}

  createSearchQuery(): SearchQueryModel {
    return {
      query: this.query(),
      page: 0,
      pageSize: 20,
      languages: ['en', 'es'],
      endpoints: this.endpoints().map((endpoint) => ({
        type: 'sparql' as const,
        url: endpoint.url,
      })),
      executionMode: 'async',
      filters: [],
      sorting: {
        predicates: ['dc:title', 'rdfs:label'],
        direction: 'asc',
      },
      retrieve: {
        selectors: [
          {
            // Fetch some predicate values for the root hits
            // Flow: Node --identifier/type/...--> string
            scope: 'roots',
            paths: [
              {
                path: 'dc:identifier|rdf:type|*',
              },
            ],
          },
          // {
          //   // For every node returned (roots + expanded nodes), fetch labels
          //   // Flow: Node --label/title--> string
          //   scope: 'all',
          //   paths: [
          //     {
          //       path: 'rdfs:label|dc:title',
          //     },
          //   ],
          // },
        ],
      },
    };
  }

  onSearchButtonClick(): void {
    const query = this.createSearchQuery();
    console.log('Search query:', query);
    this.executeSearch(query);
  }

  private executeSearch(query: SearchQueryModel): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.searchResponse.set(null);

    this.http
      .post<SearchResponseModel>('http://localhost:3000/api/search', query)
      .subscribe({
        next: (response) => {
          this.searchResponse.set(response);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Search failed');
          this.isLoading.set(false);
        },
      });
  }
}
