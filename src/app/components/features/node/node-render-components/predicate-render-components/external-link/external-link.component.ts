import { Component } from '@angular/core';
import { PredicateRenderComponent } from '../../../../../../_custom-components/custom-render-components/by-predicate/predicate-render-component.directive';

@Component({
  selector: 'app-external-link',
  imports: [],
  templateUrl: './external-link.component.html',
})
export class ExternalLinkComponent extends PredicateRenderComponent {
  get externalUrl(): string {
    return this.data?.value ?? '';
  }
}
