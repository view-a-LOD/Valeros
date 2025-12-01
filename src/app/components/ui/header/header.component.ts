import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherSearch, featherX } from '@ng-icons/feather-icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import {
  HeaderPosition,
  HeaderSettings,
} from '../../../models/settings/header-settings.model';
import { UrlService } from '../../../services/url.service';

export enum HeaderView {
  ShowingColophon,
  ShowingSearch,
}

@Component({
  selector: 'app-header',
  imports: [NgIcon, TranslatePipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() view: HeaderView = HeaderView.ShowingSearch;
  readonly settings: HeaderSettings = Settings.ui.header;

  constructor(
    public router: Router,
    public url: UrlService,
    public translate: TranslateService,
  ) {}

  get buttonUrl() {
    return this.view === HeaderView.ShowingSearch ? 'colophon' : '';
  }

  async onButtonClicked(url: string) {
    await this.url.navigateByUrlIgnoringQueryParamChange(url);
  }

  protected readonly featherSearch = featherSearch;
  protected readonly featherX = featherX;
  protected readonly HeaderView = HeaderView;
  protected readonly HeaderPosition = HeaderPosition;
}
