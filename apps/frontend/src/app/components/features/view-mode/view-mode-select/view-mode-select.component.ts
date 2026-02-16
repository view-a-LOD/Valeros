import { Component } from '@angular/core';
import {
  featherGrid,
  featherImage,
  featherList,
} from '@ng-icons/feather-icons';
import { ViewMode } from '../../../../models/view-mode.enum';
import { ViewModeService } from '../../../../services/view-mode.service';
import { ViewModeSelectOptionComponent } from './view-mode-select-option/view-mode-select-option.component';

@Component({
  selector: 'app-view-mode-select',
  imports: [ViewModeSelectOptionComponent],
  templateUrl: './view-mode-select.component.html',
  styleUrl: './view-mode-select.component.scss',
})
export class ViewModeSelectComponent {
  constructor(public viewMode: ViewModeService) {}

  protected readonly ViewMode = ViewMode;
  protected readonly featherGrid = featherGrid;
  protected readonly featherList = featherList;
  protected readonly featherImage = featherImage;
}
