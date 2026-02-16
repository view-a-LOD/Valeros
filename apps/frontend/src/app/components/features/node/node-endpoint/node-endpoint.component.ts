import { Component, Input } from '@angular/core';
import { EndpointService } from '../../../../services/endpoint.service';
import { NodeLinkComponent } from '../node-link/node-link.component';

@Component({
  selector: 'app-node-endpoint',
  imports: [NodeLinkComponent],
  templateUrl: './node-endpoint.component.html',
  styleUrl: './node-endpoint.component.scss',
})
export class NodeEndpointComponent {
  @Input() endpointId?: string;

  constructor(public endpoints: EndpointService) {}
}
