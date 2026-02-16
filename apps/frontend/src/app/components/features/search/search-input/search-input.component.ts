import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherAlertTriangle } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Settings } from '../../../../config/settings';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../../../../models/autocomplete-option.model';
import { DetailsService } from '../../../../services/details.service';
import { AutocompleteService } from '../../../../services/search/autocomplete.service';
import { SearchService } from '../../../../services/search/search.service';
import { SettingsService } from '../../../../services/settings.service';
import { FilterDrawerService } from '../../../../services/ui/filter-drawer.service';
import { UrlService } from '../../../../services/url.service';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete.component';
import { FilterButtonComponent } from '../search-buttons-toolbar/filter-button/filter-button.component';
import { SearchTipsComponent } from '../search-tips/search-tips.component';

@Component({
  selector: 'app-search-input',
  imports: [
    FormsModule,
    SearchAutocompleteComponent,
    TranslatePipe,
    NgIcon,
    FilterButtonComponent,
    SearchTipsComponent,
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit, AfterViewInit, OnDestroy {
  searchInput: string = this.search.queryStr ?? '';
  private queryParamSubscription?: Subscription;

  constructor(
    public search: SearchService,
    public router: Router,
    private route: ActivatedRoute,
    public details: DetailsService,
    public autocomplete: AutocompleteService,
    public url: UrlService,
    public settings: SettingsService,
    public filterDrawer: FilterDrawerService,
  ) {}

  ngOnInit() {
    this.initUpdateSearchInputFromQueryParams();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  initUpdateSearchInputFromQueryParams() {
    this.queryParamSubscription = this.route.queryParams.subscribe((params) => {
      const searchParam = params[Settings.url.params.search];
      if (searchParam !== undefined && searchParam !== this.searchInput) {
        this.searchInput = searchParam;
      }
    });
  }

  get hasAutocompleteOptions(): boolean {
    return this.autocomplete.options.value.length > 0;
  }

  async onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    this.autocomplete.clearOptions();
    this.autocomplete.searchSubject.next('');

    await this.router.navigate(['/search'], {
      queryParams: { [Settings.url.params.search]: this.searchInput },
      queryParamsHandling: 'merge',
    });
  }

  async onSearchInputChange() {
    if (!Settings.search.autocomplete.enabled) {
      return;
    }

    this.autocomplete.searchSubject.next(this.searchInput);
  }

  async onAutocompleteOptionSelect(option: AutocompleteOptionModel) {
    if (option.labels.length === 0) {
      console.warn('No label found for autocomplete option', option);
      return;
    }

    this.autocomplete.clearOptions();

    const isSearchOption = option.type === AutocompleteOptionType.SearchTerm;
    const isNodeOption = option.type === AutocompleteOptionType.Node;

    if (isSearchOption) {
      this.searchInput = option.labels[0];
      await this.onSearch();
    } else if (isNodeOption) {
      const url = option['@id'].replace('#', '%23');
      await this.router.navigateByUrl(this.details.getLinkFromUrl(url));
    } else {
      console.warn('Unknown autocomplete option type');
    }
  }

  protected readonly Settings = Settings;
  protected readonly featherAlertTriangle = featherAlertTriangle;
}
