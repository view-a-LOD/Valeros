import { Injectable } from '@angular/core';

import { Settings } from '../config/settings';
import { Direction, NodeModel } from '../models/node.model';
import {
  RenderComponent,
  RenderComponentSetting,
  RenderComponentSettings,
  RenderMode,
} from '../models/settings/render-component-settings.type';
import { DataService } from './data.service';
import { NodeService } from './node/node.service';

@Injectable({
  providedIn: 'root',
})
export class RenderComponentService {
  constructor(
    public nodes: NodeService,
    public data: DataService,
  ) {}

  private _getAllComponents(): RenderComponent[] {
    let components: RenderComponent[] = [];
    // TODO: Iterate over render modes dynamically
    for (const mode of [RenderMode.ByType, RenderMode.ByPredicate]) {
      const componentsForMode: RenderComponent[] = Settings.renderComponents[
        mode as RenderMode
      ].map((r) => r.component);
      components = components.concat(componentsForMode);
    }

    const uniqueComponents = Array.from(new Set(components));
    return uniqueComponents;
  }

  private _shouldShowComponent(
    node: NodeModel,
    mode: RenderMode,
    component: RenderComponent,
    predicates?: string[],
    direction?: Direction,
  ): boolean {
    return this._getComponents(node, mode, predicates, direction).includes(
      component,
    );
  }

  private _getComponents(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): RenderComponent[] {
    return this._getSettings(node, mode, predicates, direction).map(
      (setting) => setting.component,
    );
  }

  private _getSettings(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): RenderComponentSetting[] {
    if (!node) {
      return [];
    }

    const settings: RenderComponentSetting[] = [];
    let nodePreds: string[] = [];
    if (mode === RenderMode.ByType) {
      nodePreds = this.nodes.getObjValues(node, Settings.predicates.type);
    } else if (mode === RenderMode.ByPredicate) {
      nodePreds = predicates ?? [];
    }

    for (const setting of Settings.renderComponents?.[
      mode
    ] as RenderComponentSettings) {
      if (direction === undefined) {
        direction = Direction.Outgoing;
      }

      const settingsDirection =
        setting.direction === undefined ? direction : setting.direction;
      const matchesDirection = direction === settingsDirection;
      const hasOverlap = this.data.hasOverlap(nodePreds, setting.predicates);
      if (hasOverlap && matchesDirection) {
        settings.push(setting);
      }
    }

    return settings;
  }

  getComponentsToShow(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): RenderComponent[] {
    return this._getAllComponents().filter((component: RenderComponent) =>
      this._shouldShowComponent(node, mode, component, predicates, direction),
    );
  }

  getSettingByKey(
    settingKey: string,
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): any {
    // TODO: Reduce calls to this function if needed for performance reasons
    const settingsByKey = this._getSettings(
      node,
      mode,
      predicates,
      direction,
    ).map((s) => s?.[settingKey]);

    if (!settingsByKey || settingsByKey.length === 0) {
      return [];
    }

    return settingsByKey[0];
  }

  private _requiresExplicitRendering(
    component: RenderComponent,
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): boolean {
    const settings = this._getSettings(
      node,
      mode,
      predicates,
      direction,
    ).filter((setting) => setting.component === component);

    return settings.some(
      (setting) => setting.requiresExplicitRendering === true,
    );
  }

  getDynamicallyRenderedComponents(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): RenderComponent[] {
    return this.getComponentsToShow(node, mode, predicates, direction).filter(
      (component) =>
        !this._requiresExplicitRendering(
          component,
          node,
          mode,
          predicates,
          direction,
        ),
    );
  }

  getExplicitlyRenderedComponents(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): RenderComponent[] {
    return this.getComponentsToShow(node, mode, predicates, direction).filter(
      (component) =>
        this._requiresExplicitRendering(
          component,
          node,
          mode,
          predicates,
          direction,
        ),
    );
  }
}
