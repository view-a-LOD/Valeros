import { NgComponentOutlet } from '@angular/common';
import { Component, OnInit, Type } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { featherX } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomColophonComponent } from '../../../_custom-components/custom-colophons/custom-colophon.directive';
import { RazuColophonComponent } from '../../../_custom-components/custom-colophons/razu-colophon/razu-colophon.component';
import { Settings } from '../../../config/settings';
import { UrlService } from '../../../services/url.service';
import { HeaderComponent, HeaderView } from '../../ui/header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';

@Component({
  selector: 'app-colophon',
  imports: [
    HeaderComponent,
    ViewContainerComponent,
    TranslatePipe,
    RouterLink,
    RazuColophonComponent,
    NgComponentOutlet,
  ],
  templateUrl: './colophon.component.html',
})
export class ColophonComponent implements OnInit {
  colophonComponent?: Type<CustomColophonComponent> =
    Settings.content.colophonComponent;

  constructor(
    public router: Router,
    public url: UrlService,
  ) {}

  async ngOnInit() {}

  async onButtonClicked(url: string) {
    await this.url.navigateByUrlIgnoringQueryParamChange(url);
  }

  protected readonly HeaderView = HeaderView;
  protected readonly featherX = featherX;
}
