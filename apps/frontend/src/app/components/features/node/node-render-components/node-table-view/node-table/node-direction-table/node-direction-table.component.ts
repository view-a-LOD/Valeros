import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Direction, NodeModel } from '../../../../../../../models/node.model';
import {
  PredicateSection,
  PredicateVisibility,
} from '../../../../../../../models/settings/predicate-visibility-settings.model';
import { NodeService } from '../../../../../../../services/node/node.service';
import { PredicateVisibilityService } from '../../../../../../../services/predicate-visibility.service';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import {
  NodeTableCellComponent,
  TableCellShowOptions,
} from '../node-table-cell/node-table-cell.component';

@Component({
  selector: 'app-node-direction-table',
  imports: [NgClass, NodeTableCellComponent, NodeLinkComponent, TranslatePipe],
  templateUrl: './node-direction-table.component.html',
  styleUrl: './node-direction-table.component.scss',
})
export class NodeDirectionTableComponent {
  @Input() node?: NodeModel;
  @Input() visibility!: PredicateVisibility;
  @Input() direction!: Direction;

  predicateSections: PredicateSection[] = [];
  predicateVisibilities: { [pred: string]: PredicateVisibility } = {};
  numPredValues: { [pred: string]: { [direction in Direction]: number } } = {};

  constructor(
    public nodes: NodeService,
    public predVisibility: PredicateVisibilityService,
  ) {}

  ngOnInit() {
    this.initPredData();
    this.initNodePreds();
  }

  initNodePreds() {
    if (!this.node) {
      return;
    }
    const nodePreds = Object.keys(this.node);
    this.predicateSections = this.predVisibility.getSections(
      nodePreds,
      this.visibility,
    );
  }

  initPredData() {
    if (!this.node) {
      return;
    }
    for (const pred of Object.keys(this.node)) {
      this.predicateVisibilities[pred] =
        this.predVisibility.getVisibility(pred);

      for (const direction of [Direction.Outgoing, Direction.Incoming]) {
        if (!this.numPredValues[pred]) {
          (this.numPredValues[pred] as any) = {};
        }
        this.numPredValues[pred][direction] =
          this.nodes.getObjValuesByDirection(
            this.node,
            [pred],
            direction,
          ).length;
      }
    }
  }

  getNumPredValues(pred: string, direction: Direction) {
    if (!pred || direction === undefined || !this.numPredValues[pred]) {
      return 0;
    }

    return this.numPredValues[pred][direction];
  }

  hasPredsToShow(direction: Direction, visibility: PredicateVisibility) {
    return Object.entries(this.numPredValues).some(
      ([pred, numValuesByDirection]) => {
        return (
          this.predVisibility.isVisibleIn(pred, visibility) &&
          numValuesByDirection[direction] > 0
        );
      },
    );
  }

  get smallFontSize(): boolean {
    return false;
    // return this.visibility === PredicateVisibility.Details;
  }

  sectionHasPredsToShow(
    section: PredicateSection,
    direction: Direction,
  ): boolean {
    return section.predicates.some(
      (pred) =>
        this.predVisibility.isVisibleIn(pred, this.visibility) &&
        this.getNumPredValues(pred, direction) > 0,
    );
  }

  protected readonly Direction = Direction;
  protected readonly TableCellShowOptions = TableCellShowOptions;
}
