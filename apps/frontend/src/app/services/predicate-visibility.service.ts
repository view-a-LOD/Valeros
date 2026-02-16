import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { sortByArrayOrder } from '../helpers/util.helper';
import {
  PredicateSection,
  PredicateVisibility,
  PredicateVisibilityEntries,
  PredicateVisibilitySettingsByViewMode,
} from '../models/settings/predicate-visibility-settings.model';
import { ViewModeService } from './view-mode.service';

@Injectable({ providedIn: 'root' })
export class PredicateVisibilityService {
  constructor(private viewModes: ViewModeService) {}

  getVisible(): PredicateVisibilityEntries {
    return (
      Settings.predicateVisibility
        .byViewMode as PredicateVisibilitySettingsByViewMode
    )[this.viewModes.current.value];
  }

  getVisibleFlattened(visibility: PredicateVisibility): string[] {
    const visibilityEntries = this.getVisible();
    return visibilityEntries[visibility].flatMap(
      (section) => section.predicates,
    );
  }

  getVisibility(predicateId: string): PredicateVisibility {
    if (this.isVisibleIn(predicateId, PredicateVisibility.Details)) {
      return PredicateVisibility.Details;
    }

    if (this.isVisibleIn(predicateId, PredicateVisibility.SearchHits)) {
      return PredicateVisibility.SearchHits;
    }

    return PredicateVisibility.Hide;
  }

  isVisibleIn(predicateId: string, visibility: PredicateVisibility): boolean {
    const shouldAlwaysHide = (
      Settings.predicateVisibility.alwaysHide as string[]
    ).includes(predicateId);
    if (shouldAlwaysHide) {
      return false;
    }

    const hidePredicates: string[] = this.getVisibleFlattened(
      PredicateVisibility.Hide,
    );
    const shouldHide: boolean = hidePredicates.includes(predicateId);
    if (shouldHide) {
      return false;
    }

    const visible: PredicateVisibilityEntries = this.getVisible();
    const sections: PredicateSection[] = visible[visibility];
    const predicates: string[] = sections.flatMap((s) => s.predicates);

    const hasWildcard: boolean = predicates.includes('*');
    const isExplicit: boolean = predicates.includes(predicateId);

    if (isExplicit) {
      return true;
    }

    if (hasWildcard) {
      return true;
    }

    return false;
  }

  getSections(
    nodePredicates: string[],
    visibility: PredicateVisibility,
  ): PredicateSection[] {
    const settingsSections = this.getVisible()[visibility];

    const orderedSections = settingsSections.map((section) => ({
      ...section,
      predicates: [] as string[],
    }));

    const wildcardSectionIndex = settingsSections.reduceRight(
      (lastIndex, section, index) =>
        section.predicates.includes('*') ? index : lastIndex,
      -1,
    );

    // For each predicate in node, find section it belongs to (either explicit or through wildcard)
    nodePredicates.forEach((pred) => {
      const explicitSectionIndex = settingsSections.findIndex((section) =>
        section.predicates.includes(pred),
      );

      const sectionIndex =
        explicitSectionIndex >= 0 ? explicitSectionIndex : wildcardSectionIndex;
      if (sectionIndex >= 0) {
        orderedSections[sectionIndex].predicates.push(pred);
      }
    });

    // Sort predicates within each section according to settings order
    orderedSections.forEach((section, index) => {
      const settingsPredicates = settingsSections[index].predicates;
      section.predicates = sortByArrayOrder(
        section.predicates,
        settingsPredicates,
      );
    });

    return orderedSections;
  }
}
