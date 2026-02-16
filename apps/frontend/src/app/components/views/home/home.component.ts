import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DetailsService } from '../../../services/details.service';
import { NodeService } from '../../../services/node/node.service';
import { SearchService } from '../../../services/search/search.service';
import { SettingsService } from '../../../services/settings.service';
import { ScrollService } from '../../../services/ui/scroll.service';
import { ViewModeService } from '../../../services/view-mode.service';
import { SearchInputComponent } from '../../features/search/search-input/search-input.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { LangSwitchComponent } from '../../ui/lang-switch/lang-switch.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { HomeIntroBelowSearchComponent } from './home-intro/home-intro-below-search/home-intro-below-search.component';
import { HomeIntroComponent } from './home-intro/home-intro.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeIntroComponent,
    LangSwitchComponent,
    HeaderComponent,
    SearchInputComponent,
    HeaderComponent,
    ViewContainerComponent,
    HomeIntroComponent,
    HomeIntroBelowSearchComponent,
    LangSwitchComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
    public router: Router,
    public nodes: NodeService,
    public scroll: ScrollService,
    public details: DetailsService,
    public settings: SettingsService,
    public translate: TranslateService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}
}
