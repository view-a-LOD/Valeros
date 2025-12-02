import { Type } from '@angular/core';
import { CustomColophonComponent } from '../../components/custom-components/custom-colophons/custom-colophon.directive';
import { CustomSearchTipsComponent } from '../../components/custom-components/custom-search-tips/custom-search-tips.directive';

export interface ContentSettings {
  colophonComponent?: Type<CustomColophonComponent>;
  searchTipsComponent?: Type<CustomSearchTipsComponent>;

  /**
   * Preferred literal languages (e.g. ['nl', 'en', 'en-us']).
   * Used for SPARQL literal language filtering.
   * If not provided, no language filtering will be applied.
   */
  sparqlLanguageFilterForLiterals?: string[];

  translations: {
    /**
     * Base path for translation files, relative to assets folder
     */
    basePath: string;
    /**
     * File extension for translation files
     */
    fileExtension: string;
  };
}
