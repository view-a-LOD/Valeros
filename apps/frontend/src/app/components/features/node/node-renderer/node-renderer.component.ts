import { NgComponentOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Settings } from '../../../../config/settings';
import { NodeModel } from '../../../../models/node.model';
import {
  RenderComponent,
  RenderMode,
} from '../../../../models/settings/render-component-settings.type';
import { TypeRenderComponentInput } from '../../../../models/type-render-component-input.model';
import { NodeService } from '../../../../services/node/node.service';
import { RenderComponentService } from '../../../../services/render-component.service';
import { NodeTableViewComponent } from '../node-render-components/node-table-view/node-table-view.component';

@Component({
  selector: 'app-node-renderer',
  imports: [NodeTableViewComponent, NgComponentOutlet],
  templateUrl: './node-renderer.component.html',
  styleUrl: './node-renderer.component.scss',
})
export class NodeRendererComponent implements OnInit {
  @Input() node?: NodeModel;

  componentsToShow: RenderComponent[] = [];
  hasComponents = false;

  constructor(
    public nodes: NodeService,
    public renderComponents: RenderComponentService,
  ) {}

  ngOnInit() {
    this.initComponents();
  }

  initComponents() {
    if (!this.node) {
      return;
    }
    this.componentsToShow = this.renderComponents.getComponentsToShow(
      this.node,
      RenderMode.ByType,
    );

    this.hasComponents = this.componentsToShow.length > 0;
  }

  getTypeRenderComponentInput(): TypeRenderComponentInput | null {
    if (!this.node) {
      return null;
    }
    return {
      node: this.node,
    };
  }

  protected readonly Settings = Settings;
  protected readonly RenderMode = RenderMode;
}
