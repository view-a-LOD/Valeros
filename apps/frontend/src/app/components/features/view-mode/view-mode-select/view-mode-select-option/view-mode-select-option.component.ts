import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ViewMode } from '../../../../../models/view-mode.enum';
import { ViewModeService } from '../../../../../services/view-mode.service';

@Component({
  selector: 'app-view-mode-select-option',
  imports: [NgClass, NgIcon, TranslatePipe],
  templateUrl: './view-mode-select-option.component.html',
  styleUrl: './view-mode-select-option.component.scss',
})
export class ViewModeSelectOptionComponent {
  @Input() viewMode!: ViewMode;
  @Input() iconSvg?: string;

  constructor(public viewModes: ViewModeService) {}

  getAriaLabel(): string {
    return this.viewMode === ViewMode.List
      ? 'view-mode.list-view'
      : 'view-mode.grid-view';
  }

  protected readonly ViewMode = ViewMode;
}
