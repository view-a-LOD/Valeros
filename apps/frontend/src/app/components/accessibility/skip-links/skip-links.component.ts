import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { DetailsService } from '../../../services/details.service';
import { FilterDrawerService } from '../../../services/ui/filter-drawer.service';

@Component({
  selector: 'app-skip-links',
  imports: [TranslatePipe],
  templateUrl: './skip-links.component.html',
  styleUrl: './skip-links.component.scss',
})
export class SkipLinksComponent {
  private filterDrawer = inject(FilterDrawerService);
  details = inject(DetailsService);

  skipToSearch() {
    this.focusElement('#search-input input', true);
  }

  skipToFilters() {
    this.filterDrawer.open();
  }

  skipToResults() {
    this.focusElement('#search-results', true);
  }

  skipToNodeDetails() {
    this.focusElement('#node-details', true);
  }

  skipToImageViewer() {
    this.focusElement('app-mirador', true);
  }

  private focusElement(selector: string, scrollIntoView = false) {
    const element: HTMLElement | null = document.querySelector(selector);
    if (element) {
      element.setAttribute('tabindex', '-1');
      element.focus();
      if (scrollIntoView) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }
}
