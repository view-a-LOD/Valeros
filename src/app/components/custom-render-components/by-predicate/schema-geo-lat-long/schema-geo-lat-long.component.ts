import { Component, OnInit } from '@angular/core';
import { NodeLinkComponent } from '../../../features/node/node-link/node-link.component';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-schema-geo-lat-long',
  standalone: true,
  imports: [NodeLinkComponent, HopLinkComponent],
  templateUrl: './schema-geo-lat-long.component.html',
})
export class SchemaGeoLatLongComponent
  extends PredicateRenderComponent
  implements OnInit
{
  ngOnInit(): void {}
}
