import { Type } from '@angular/core';
import { CustomColophonComponent } from '../../components/views/colophon/custom-colophons/custom-colophon.directive';

export interface ContentSettings {
  colophon?: Type<CustomColophonComponent>;
}
