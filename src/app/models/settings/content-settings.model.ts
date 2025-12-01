import { Type } from '@angular/core';
import { CustomColophonComponent } from '../../components/views/colophon/custom-colophons/custom-colophon.directive';

export interface ContentSettings {
  colophonComponent?: Type<CustomColophonComponent>;

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
