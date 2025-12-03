import { Component } from '@angular/core';
import { HopLinkComponent } from '../../../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-rico-date',
  imports: [HopLinkComponent],
  templateUrl: './rico-date.component.html',
})
export class RicoDateComponent extends PredicateRenderComponent {}
