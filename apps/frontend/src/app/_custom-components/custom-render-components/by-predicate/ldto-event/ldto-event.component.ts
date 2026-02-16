import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { HopLinkComponent } from '../../../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-ldto-event',
  imports: [HopLinkComponent, NgClass],
  templateUrl: './ldto-event.component.html',
  styleUrl: './ldto-event.component.scss',
})
export class LdtoEventComponent extends PredicateRenderComponent {
  hasTime = false;
}
