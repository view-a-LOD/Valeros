import {
  Component,
  inject,
  Input,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { Settings } from '../../../config/settings';
import { SearchService } from '../../../services/search/search.service';

@Component({
  selector: 'app-snippet',
  imports: [],
  templateUrl: './snippet.component.html',
  styleUrl: './snippet.component.scss',
})
export class SnippetComponent implements OnInit {
  @Input() altoUrl?: string;
  loading = false;
  snippet?: string;

  searchService = inject(SearchService);

  ngOnInit(): void {
    void this.retrieveSnippet();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['altoUrl'] || changes['searchService.queryStr']) {
      void this.retrieveSnippet();
    }
  }

  async retrieveSnippet(): Promise<void> {
    const snippetUrl = Settings.endpoints?.snippetServer;
    if (!this.altoUrl || !snippetUrl || !this.searchService.queryStr?.trim()) {
      return;
    }

    this.loading = true;
    try {
      const query = this.searchService.queryStr;
      const response = await fetch(snippetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: this.altoUrl, q: `${query}` }),
      });

      if (!response.ok) {
        console.error('Failed to fetch snippet:', response.statusText);
        this.snippet = undefined;
        return;
      }

      const data = await response.json();
      this.snippet = data.html ?? undefined;
    } catch (error) {
      console.error('An error occurred while retrieving the snippet:', error);
      this.snippet = undefined;
    } finally {
      this.loading = false;
    }
  }
}
