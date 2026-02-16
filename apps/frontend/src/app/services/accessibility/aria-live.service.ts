import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchService } from '../search/search.service';

@Injectable({
  providedIn: 'root',
})
export class AriaLiveService {
  message: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(public search: SearchService) {
    this.initMessageUpdateOnSearchResultsUpdate();
  }

  private initMessageUpdateOnSearchResultsUpdate() {
    this.search.results.subscribe((results) => {
      const numSearchResults = results.nodes?.length ?? 0;
      const searchQuery = this.search.queryStr ?? '';
      const searchQueryText = searchQuery ? `voor "${searchQuery}"` : '';

      if (numSearchResults === 0) {
        this.message.next(
          `Er zijn geen resultaten gevonden ${searchQueryText}`,
        );
      } else if (numSearchResults === 1) {
        this.message.next(`Er is 1 resultaat gevonden ${searchQueryText}`);
      } else {
        this.message.next(
          `Er zijn ${numSearchResults} resultaten gevonden ${searchQueryText}`,
        );
      }
      console.log(this.message.value);
    });
  }
}
