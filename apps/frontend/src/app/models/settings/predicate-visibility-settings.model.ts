import { ViewMode } from '../view-mode.enum';

export interface PredicateSection {
  label?: string;
  predicates: string[];
}

export type PredicateVisibilitySettingsByViewMode = {
  [v in ViewMode]: PredicateVisibilityEntries;
};

export interface PredicateVisibilitySettings {
  byViewMode: PredicateVisibilitySettingsByViewMode;
  alwaysHide: string[];

  /** By default, types are rendered using the NodeTypeComponent.
   * If a type should not be displayed for a node, add it to this list.
   */
  hideTypeBadges: string[];
}

export enum PredicateVisibility {
  SearchHits,
  Details,
  Hide,
}

export type PredicateVisibilityEntries = {
  [v in PredicateVisibility]: PredicateSection[];
};
