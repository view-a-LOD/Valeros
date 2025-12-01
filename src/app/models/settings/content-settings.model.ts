import { Type } from '@angular/core';
import { CustomSearchTipsComponent } from '../../components/features/search/search-tips/custom-search-tips/custom-search-tips.directive';
import { CustomColophonComponent } from '../../components/views/colophon/custom-colophons/custom-colophon.directive';

export interface ContentSettings {
  colophonComponent?: Type<CustomColophonComponent>;
  searchTipsComponent?: Type<CustomSearchTipsComponent>;

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
