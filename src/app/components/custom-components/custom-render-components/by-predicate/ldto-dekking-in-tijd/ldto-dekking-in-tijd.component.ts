import { Component } from '@angular/core';
import { HopLinkComponent } from '../../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-ldto-dekking-in-tijd',
  imports: [HopLinkComponent],
  templateUrl: './ldto-dekking-in-tijd.component.html',
  styleUrl: './ldto-dekking-in-tijd.component.scss',
})
export class LdtoDekkingInTijdComponent extends PredicateRenderComponent {
  hasBeginDate = false;
  hasEndDate = false;
  hasType = false;
}
