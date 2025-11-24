import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { SparqlService } from '../../../../services/sparql.service';
import { NodeLinkComponent } from '../../../features/node/node-link/node-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-as-wkt',
  standalone: true,
  imports: [NodeLinkComponent, JsonPipe],
  templateUrl: './asWkt.component.html',
  styleUrl: './asWkt.component.scss',
})
export class AsWktComponent extends PredicateRenderComponent implements OnInit {
  constructor(
    public api: ApiService,
    public sparql: SparqlService,
  ) {
    super();
  }

  ngOnInit(): void {}
}
