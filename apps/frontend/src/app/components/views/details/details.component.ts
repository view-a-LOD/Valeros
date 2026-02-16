import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { featherArrowLeft } from '@ng-icons/feather-icons';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { RoutingService } from '../../../services/routing.service';
import { SparqlService } from '../../../services/sparql.service';
import { ScrollService } from '../../../services/ui/scroll.service';
import { NodeComponent } from '../../features/node/node.component';

@Component({
  selector: 'app-details',
  imports: [NodeComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  nodeId: string | null = null;

  loadingNodeData = false;

  constructor(
    private route: ActivatedRoute,
    public nodes: NodeService,
    public sparql: SparqlService,
    public routing: RoutingService,
    public details: DetailsService,
    public scroll: ScrollService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let nodeId = params.get('id');
      if (!nodeId) {
        return;
      }

      nodeId = this.removeHashFromNodeId(nodeId);
      nodeId = decodeURIComponent(nodeId);

      this.scroll.onNavigateToDetails(nodeId);
      void this.initNodeById(nodeId);
    });
  }

  private removeHashFromNodeId(nodeId: string) {
    let hashIndex = nodeId.indexOf('%23');
    if (hashIndex !== -1) {
      nodeId = nodeId.substring(0, hashIndex);
    }
    return nodeId;
  }

  async initNodeById(id: string) {
    this.details.node.next(undefined);
    this.nodeId = null;

    this.loadingNodeData = true;

    setTimeout(async () => {
      this.nodeId = id;
      const node = await this.sparql.getNode(this.nodeId);
      const enrichedNodes = await this.nodes.enrichWithIncomingRelations([
        node,
      ]);
      this.details.node.next(enrichedNodes[0] ?? node);
      this.loadingNodeData = false;
    });
  }

  protected readonly featherArrowLeft = featherArrowLeft;
}
