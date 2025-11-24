import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, filter, firstValueFrom, take } from 'rxjs';
import { Settings } from '../config/settings';
import { NodeModel } from '../models/node.model';
import { LabelsCacheService } from './cache/labels-cache.service';
import { DetailsService } from './details.service';
import { NodeService } from './node/node.service';
import { SearchService } from './search/search.service';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  private get siteTitlePrefix(): string {
    return Settings.ui.siteTitlePrefix || '';
  }

  constructor(
    private titleService: Title,
    private router: Router,
    private search: SearchService,
    private translate: TranslateService,
    private details: DetailsService,
    private labelsCache: LabelsCacheService,
    private nodeService: NodeService,
  ) {}

  private setTitleWithPrefix(title: string): void {
    const fullTitle = this.siteTitlePrefix
      ? `${this.siteTitlePrefix} - ${title}`
      : title;
    this.titleService.setTitle(fullTitle);
  }

  initPageTitleUpdates() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle();
      }
    });

    // Update details page title based on node label
    this.details.node
      .pipe(
        filter((node): node is NodeModel => !!node && this.details.isShowing()),
        debounceTime(100),
      )
      .subscribe((node) => {
        this.setDetailsPageTitle(node);
      });
  }

  updatePageTitle() {
    const url = this.router.url;
    if (url.startsWith('/colofon')) {
      this.setColofonPageTitle();
    } else if (url.startsWith('/search')) {
      setTimeout(() => {
        this.setSearchPageTitle();
      });
    } else if (url.startsWith('/details')) {
      this.setTitleWithPrefix('Details pagina laden...');
    } else {
      this.setHomePageTitle();
    }
  }

  async setHomePageTitle() {
    const homeTitle = await firstValueFrom(
      this.translate.get('general.page-title'),
    );
    this.setTitleWithPrefix(homeTitle);
  }

  async setColofonPageTitle() {
    const colofonTitle = await firstValueFrom(
      this.translate.get('general.colofon-title'),
    );
    this.setTitleWithPrefix(colofonTitle);
  }

  setSearchPageTitle() {
    this.setTitleWithPrefix(
      `Zoekresultaten "${this.search.queryStr?.toString() || ''}"`,
    );
  }

  async setDetailsPageTitle(node: NodeModel) {
    const nodeId = this.nodeService.getId(node);
    await this.labelsCache.cacheLabelForId(nodeId);

    this.labelsCache.labels
      .pipe(
        filter((labels) => {
          const hasLabel = !!labels[nodeId];
          const labelIsNotNodeId = labels[nodeId] !== nodeId;
          return hasLabel && labelIsNotNodeId;
        }),
        take(1),
      )
      .subscribe((labels) => {
        console.log('Updating node details title', nodeId, labels[nodeId]);
        this.setTitleWithPrefix(labels[nodeId]);
      });
    // TODO: Handle case where no label is found (set a default/fallback title)
  }
}
