import { Type } from '@angular/core';
import { PredicateRenderComponent } from '../../_custom-components/custom-render-components/by-predicate/predicate-render-component.directive';
import { TypeRenderComponent } from '../../_custom-components/custom-render-components/by-type/type-render-component.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { NodeTypeComponent } from '../../components/features/node/node-types/node-type/node-type.component';
import { Direction } from '../node.model';
import { HopLinkSettings } from './hop-link-settings.model';

export type RenderComponentsSettings = {
  [v in RenderMode]: RenderComponentSettings;
};

export enum RenderMode {
  /**
   * Overrule the entire way a node is displayed based on its type.
   * For example, render a custom component for all nodes with type sdo:CreativeWork
   * instead of using the default table view.
   */
  ByType,

  /**
   * Overrule the way a node value is displayed based on the predicate.
   * For example, render a file renderer for all values of the predicate
   * http://xmlns.com/foaf/0.1/depiction instead of using the default node link.
   */
  ByPredicate,
}

type ExplicitlyRenderedComponent = FileRendererComponent | NodeTypeComponent;

export type RenderComponent = Type<
  PredicateRenderComponent | ExplicitlyRenderedComponent | TypeRenderComponent
>;

export type RenderComponentSetting = {
  component: RenderComponent;
  predicates: string[];
  direction?: Direction;
  hopLinkSettings?: HopLinkSettings;
  /**
   * Some components (e.g., NodeTypeComponent, FileRendererComponent) are used elsewhere throughout the codebase
   * and are not exclusively used as predicate render components. These components
   * have their own pre-defined input properties instead of using the default
   * PredicateRenderComponentInput data structure. Setting this to true indicates
   * that the component needs to be manually and explicitly configured in NodeTableCellComponent (where predicate rendercomponents are rendered by default).
   */
  requiresExplicitRendering?: boolean;
  [key: string]: any;
};

export type RenderComponentSettings = RenderComponentSetting[];
