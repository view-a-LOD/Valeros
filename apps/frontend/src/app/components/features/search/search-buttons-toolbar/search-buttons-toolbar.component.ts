import { Component, type OnInit } from '@angular/core';
import { featherHome } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../config/settings';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { FilterDrawerService } from '../../../../services/ui/filter-drawer.service';
import { UiService } from '../../../../services/ui/ui.service';
import { UrlService } from '../../../../services/url.service';
import { ViewModeSelectComponent } from '../../view-mode/view-mode-select/view-mode-select.component';
import { FilterButtonComponent } from './filter-button/filter-button.component';

@Component({
  selector: 'app-search-buttons-toolbar',
  imports: [ViewModeSelectComponent, FilterButtonComponent, TranslatePipe],
  templateUrl: './search-buttons-toolbar.component.html',
})
export class SearchButtonsToolbarComponent implements OnInit {
  constructor(
    private url: UrlService,
    public ui: UiService,
    public breakpoint: BreakpointService,
    public filterDrawer: FilterDrawerService,
  ) {}

  ngOnInit() {}

  async onHomeClicked() {
    await this.url.navigateByUrlIgnoringQueryParamChange('');
  }

  protected readonly Settings = Settings;
  protected readonly featherHome = featherHome;
}
