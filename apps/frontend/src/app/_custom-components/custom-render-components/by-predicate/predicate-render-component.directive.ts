import { Directive, Input } from '@angular/core';
import { PredicateRenderComponentInput } from '../../../models/predicate-render-component-input.model';

@Directive()
export abstract class PredicateRenderComponent {
  @Input() data?: PredicateRenderComponentInput;
}
