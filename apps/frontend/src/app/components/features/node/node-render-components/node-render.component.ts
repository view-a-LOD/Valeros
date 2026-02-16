import { Component, Input } from '@angular/core';
import { NodeModel } from '../../../../models/node.model';
import { NodeService } from '../../../../services/node/node.service';

@Component({
  selector: 'app-node-render-components',
  imports: [],
  template: ``,
})
export class NodeRenderComponent {
  @Input() node?: NodeModel;

  constructor(public nodes: NodeService) {}
}
