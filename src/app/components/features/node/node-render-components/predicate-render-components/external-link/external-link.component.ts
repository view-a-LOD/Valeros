import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherArrowUpRight } from '@ng-icons/feather-icons';
import { PredicateRenderComponent } from '../../../../../../_custom-components/custom-render-components/by-predicate/predicate-render-component.directive';

@Component({
  selector: 'app-external-link',
  imports: [NgIcon],
  templateUrl: './external-link.component.html',
})
export class ExternalLinkComponent extends PredicateRenderComponent {
  get externalUrl(): string {
    return this.data?.value ?? '';
  }

  get externalDomain(): string {
    const raw = this.externalUrl.trim();
    if (!raw) {
      return '';
    }

    try {
      const url = new URL(raw);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return raw;
    }
  }

  protected readonly featherArrowUpRight = featherArrowUpRight;
}
