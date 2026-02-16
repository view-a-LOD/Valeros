import { NgComponentOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherArrowUpLeft } from '@ng-icons/feather-icons';
import { Settings } from '../../../../../../../config/settings';
import { Direction, NodeModel } from '../../../../../../../models/node.model';
import { PredicateRenderComponentInput } from '../../../../../../../models/predicate-render-component-input.model';
import {
  RenderComponent,
  RenderMode,
} from '../../../../../../../models/settings/render-component-settings.type';
import { NodeService } from '../../../../../../../services/node/node.service';
import { RenderComponentService } from '../../../../../../../services/render-component.service';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { NodeTypeComponent } from '../../../../node-types/node-type/node-type.component';
import { FileRendererComponent } from '../../../predicate-render-components/file-renderer/file-renderer.component';

export enum TableCellShowOptions {
  Pred,
  Obj,
}

@Component({
  selector: 'app-node-table-cell',
  imports: [
    NgIcon,
    NodeLinkComponent,
    NodeTypeComponent,
    FileRendererComponent,
    NgComponentOutlet,
  ],
  templateUrl: './node-table-cell.component.html',
  styleUrl: './node-table-cell.component.scss',
})
export class NodeTableCellComponent implements OnInit {
  @Input() pred?: string;
  @Input() node?: NodeModel;
  @Input() direction?: Direction;
  @Input() show?: TableCellShowOptions;

  numObjValuesToShow = Settings.ui.objValues.numToShowByDefault;
  renderComponents: RenderComponent[] = [];
  explicitlyRenderedComponents: RenderComponent[] = [];
  dynamicallyRenderedComponents: RenderComponent[] = [];
  hasRenderComponents = false;

  objValues: string[] = [];

  constructor(
    public nodes: NodeService,
    public renderComponent: RenderComponentService,
  ) {}

  ngOnInit() {
    this.initRenderComponents();
    this.initObjValues();
  }

  getPredicateRenderComponentInput(
    objValue: string,
  ): PredicateRenderComponentInput | null {
    if (!this.node || !this.pred) {
      return null;
    }
    return {
      nodeId: this.nodes.getId(this.node),
      value: objValue,
      hopLinkSettings: this.renderComponent.getSettingByKey(
        'hopLinkSettings',
        this.node,
        RenderMode.ByPredicate,
        [this.pred],
        this.direction,
      ),
    };
  }

  initObjValues() {
    if (this.direction === undefined || !this.pred) {
      return;
    }

    this.objValues = this.nodes.getObjValuesByDirection(
      this.node,
      [this.pred],
      this.direction,
    );
  }

  initRenderComponents() {
    if (!this.node) {
      return;
    }

    const preds = this.pred ? [this.pred] : [];

    this.renderComponents = this.renderComponent.getComponentsToShow(
      this.node,
      RenderMode.ByPredicate,
      preds,
      this.direction,
    );

    this.explicitlyRenderedComponents =
      this.renderComponent.getExplicitlyRenderedComponents(
        this.node,
        RenderMode.ByPredicate,
        preds,
        this.direction,
      );

    this.dynamicallyRenderedComponents =
      this.renderComponent.getDynamicallyRenderedComponents(
        this.node,
        RenderMode.ByPredicate,
        preds,
        this.direction,
      );

    this.hasRenderComponents = this.renderComponents.length > 0;
  }

  get isIncoming() {
    return this.direction === Direction.Incoming;
  }

  get objValuesToShow(): string[] {
    return this.objValues.slice(0, this.numObjValuesToShow);
  }

  get numObjValuesNotShown(): number {
    return this.objValues.length - this.numObjValuesToShow;
  }

  loadMoreObjValues() {
    this.numObjValuesToShow += Settings.ui.objValues.additionalNumToShowOnClick;
  }

  get showMoreLabel(): string {
    return `Laad nog ${Math.min(
      this.numObjValuesNotShown,
      Settings.ui.objValues.additionalNumToShowOnClick,
    )} resultaten`;
  }

  getSettingByKey(key: string): any {
    if (!this.node || !this.pred || this.direction === undefined) {
      return [];
    }

    return this.renderComponent.getSettingByKey(
      key,
      this.node,
      RenderMode.ByPredicate,
      [this.pred],
      this.direction,
    );
  }

  protected readonly TableCellShowOptions = TableCellShowOptions;
  protected readonly RenderMode = RenderMode;
  protected readonly Settings = Settings;
  protected readonly featherArrowUpLeft = featherArrowUpLeft;
  protected readonly NodeTypeComponent = NodeTypeComponent;
  protected readonly FileRendererComponent = FileRendererComponent;
}
