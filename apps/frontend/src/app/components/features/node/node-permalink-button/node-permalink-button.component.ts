import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NodeModel } from '../../../../models/node.model';
import { EndpointService } from '../../../../services/endpoint.service';
import { NodeService } from '../../../../services/node/node.service';
import { UrlService } from '../../../../services/url.service';

@Component({
  selector: 'app-node-permalink-button',
  imports: [TranslatePipe],
  templateUrl: './node-permalink-button.component.html',
  styleUrl: './node-permalink-button.component.scss',
})
export class NodePermalinkButtonComponent implements OnChanges {
  @Input() node: NodeModel | undefined;
  processedUrl: string = '';

  constructor(
    public urlService: UrlService,
    public nodes: NodeService,
    public endpoints: EndpointService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node']) {
      this.processUrl();
    }
  }

  async processUrl() {
    if (!this.node) {
      return;
    }

    this.processedUrl = await this.urlService.processUrl(
      this.nodes.getId(this.node),
      false,
    );
  }

  get endpointName(): string {
    if (!this.node) {
      return '';
    }
    return (
      this.endpoints.getById(this.nodes.getEndpointId(this.node))?.label ??
      'Onbekend'
    );
  }
}
