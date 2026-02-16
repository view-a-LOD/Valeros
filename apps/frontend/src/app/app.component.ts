import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  featherChevronLeft,
  featherChevronRight,
  featherFilter,
  featherX,
} from '@ng-icons/feather-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { AriaLiveComponent } from './components/accessibility/aria-live/aria-live.component';
import { FilterOptionsComponent } from './components/features/filters/filter-options/filter-options.component';
import { PageTitleService } from './services/page-title.service';
import { RoutingService } from './services/routing.service';
import { FilterDrawerService } from './services/ui/filter-drawer.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    PdfJsViewerModule,
    AriaLiveComponent,
    FilterOptionsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Valeros';

  constructor(
    private translate: TranslateService,
    private routing: RoutingService,
    private pageTitle: PageTitleService,
    public filterDrawer: FilterDrawerService,
    private router: Router,
  ) {
    this.translate.addLangs(['nl', 'en']);
    this.translate.setDefaultLang('nl');
    this.translate.use('nl');
    this.routing.initHistoryTracking();
    this.pageTitle.initPageTitleUpdates();
  }

  // TODO: Reduce calls if necessary for performance reasons
  isSearchPage() {
    return this.router.url.startsWith('/search');
  }

  onFilterDrawerCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.filterDrawer.updateFromCheckbox(checkbox.checked);
  }

  protected readonly featherChevronLeft = featherChevronLeft;
  protected readonly featherChevronRight = featherChevronRight;
  protected readonly featherFilter = featherFilter;
  protected readonly featherX = featherX;
}
