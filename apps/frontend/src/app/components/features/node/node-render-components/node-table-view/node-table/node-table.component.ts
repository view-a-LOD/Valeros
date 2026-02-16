import { Component, Input, OnInit } from '@angular/core';
import { Direction, NodeModel } from '../../../../../../models/node.model';
import { PredicateVisibility } from '../../../../../../models/settings/predicate-visibility-settings.model';
import { NodeService } from '../../../../../../services/node/node.service';
import { NodeDirectionTableComponent } from './node-direction-table/node-direction-table.component';

@Component({
  selector: 'app-node-table',
  imports: [NodeDirectionTableComponent],
  templateUrl: './node-table.component.html',
  styleUrl: './node-table.component.scss',
})
export class NodeTableComponent implements OnInit {
  @Input() node?: NodeModel;
  @Input() visibility!: PredicateVisibility;

  constructor(public nodes: NodeService) {}

  ngOnInit(): void {}

  protected readonly Direction = Direction;
}
