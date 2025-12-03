import { Component, OnInit } from '@angular/core';
import { HopLinkComponent } from '../../../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-schema-geo',
  standalone: true,
  imports: [HopLinkComponent],
  templateUrl: './schema-geo.component.html',
})
export class SchemaGeoComponent
  extends PredicateRenderComponent
  implements OnInit
{
  latitude: string[] = [];
  longitude: string[] = [];
  polygon: string[] = [];

  ngOnInit(): void {}
}
