import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { formatNumber } from '../../../../helpers/util.helper';
import { DetailsService } from '../../../../services/details.service';
import { SearchService } from '../../../../services/search/search.service';

@Component({
  selector: 'app-search-hits-counter',
  imports: [TranslatePipe],
  templateUrl: './search-hits-counter.component.html',
  styleUrl: './search-hits-counter.component.scss',
})
export class SearchHitsCounterComponent {
  constructor(
    public search: SearchService,
    public details: DetailsService,
    private translate: TranslateService,
  ) {}

  get numberOfHitsStr(): string {
    if (!this.search.numberOfHits) {
      return this.translate.instant('search-interface.no-results-found');
    }
    if (this.search.numberOfHits === 1) {
      return this.translate.instant('search-interface.1-result');
    }
    return `${formatNumber(this.search.numberOfHits)}${this.search.numberOfHitsIsCappedByElastic ? '+' : ''} ${this.translate.instant('search-interface.results')}`;
  }
}
