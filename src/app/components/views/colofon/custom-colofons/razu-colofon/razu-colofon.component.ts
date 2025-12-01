import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { featherX } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { UrlService } from '../../../../../services/url.service';
import {
  HeaderComponent,
  HeaderView,
} from '../../../../ui/header/header.component';
import { ViewContainerComponent } from '../../../view-container/view-container.component';

@Component({
  selector: 'app-razu-colofon',
  imports: [HeaderComponent, ViewContainerComponent, TranslatePipe, RouterLink],
  templateUrl: './razu-colofon.component.html',
  styleUrl: './razu-colofon.component.scss',
})
export class RazuColofonComponent implements OnInit {
  protected readonly HeaderView = HeaderView;
  protected readonly featherX = featherX;
  constructor(
    public router: Router,
    public url: UrlService,
  ) {}

  async ngOnInit() {}

  async onButtonClicked(url: string) {
    await this.url.navigateByUrlIgnoringQueryParamChange(url);
  }
}
