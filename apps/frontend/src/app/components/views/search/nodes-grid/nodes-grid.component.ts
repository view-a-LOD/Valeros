import { Component, Input } from '@angular/core';
import { NodeModel } from '../../../../models/node.model';
import { NodeComponent } from '../../../features/node/node.component';

@Component({
  selector: 'app-nodes-grid',
  imports: [NodeComponent],
  templateUrl: './nodes-grid.component.html',
  styleUrl: './nodes-grid.component.scss',
})
export class NodesGridComponent {
  @Input() nodes?: NodeModel[];
}
