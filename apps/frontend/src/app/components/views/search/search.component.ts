import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { Settings } from '../../../config/settings';
import { FilterPanelLocation } from '../../../models/settings/filter-panel-location.enum';
import { ViewMode } from '../../../models/view-mode.enum';
import { BreakpointService } from '../../../services/breakpoint.service';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { SearchService } from '../../../services/search/search.service';
import { SettingsService } from '../../../services/settings.service';
import { ScrollService } from '../../../services/ui/scroll.service';
import { UrlService } from '../../../services/url.service';
import { ViewModeService } from '../../../services/view-mode.service';
import { SkipLinksComponent } from '../../accessibility/skip-links/skip-links.component';
import { NodeComponent } from '../../features/node/node.component';
import { LoadMoreSearchResultsButtonComponent } from '../../features/search/load-more-search-results-button/load-more-search-results-button.component';
import { SearchButtonsToolbarComponent } from '../../features/search/search-buttons-toolbar/search-buttons-toolbar.component';
import { SearchHitsCounterComponent } from '../../features/search/search-hits-counter/search-hits-counter.component';
import { SearchInputComponent } from '../../features/search/search-input/search-input.component';
import { SortSelectComponent } from '../../features/sort/sort-select/sort-select.component';
import { DetailsBackButtonComponent } from '../../ui/details-back-button/details-back-button.component';
import { LangSwitchComponent } from '../../ui/lang-switch/lang-switch.component';
import { DetailsComponent } from '../details/details.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { NodesGridComponent } from './nodes-grid/nodes-grid.component';

@Component({
  selector: 'app-search',
  imports: [
    NodeComponent,
    SearchInputComponent,
    NodesGridComponent,
    DetailsComponent,
    SortSelectComponent,
    LoadMoreSearchResultsButtonComponent,
    SearchHitsCounterComponent,
    DetailsBackButtonComponent,
    LangSwitchComponent,
    ViewContainerComponent,
    SearchButtonsToolbarComponent,
    TranslatePipe,
    SkipLinksComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
    public router: Router,
    public nodes: NodeService,
    public scroll: ScrollService,
    public details: DetailsService,
    public settings: SettingsService,
    private url: UrlService,
    public breakpoint: BreakpointService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scroll.initScrollContainer(this.scrollContainer);
  }

  async onHomeClicked() {
    await this.url.navigateByUrlIgnoringQueryParamChange('');
  }

  protected readonly ViewMode = ViewMode;
  protected readonly Settings = Settings;
  protected readonly FilterPanelLocation = FilterPanelLocation;
  protected readonly filter = filter;
}
