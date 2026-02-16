import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';

@Component({
  selector: 'app-lang-switch',
  imports: [NgClass],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})
export class LangSwitchComponent {
  constructor(public translate: TranslateService) {}

  protected readonly Settings = Settings;
}
