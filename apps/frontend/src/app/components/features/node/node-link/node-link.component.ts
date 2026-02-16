import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  featherExternalLink,
  featherFilter,
  featherMaximize2,
  featherSearch,
  featherX,
} from '@ng-icons/feather-icons';

import {
  isValidHttpUrl,
  isValidUrl,
  replacePrefixes,
  wrapWithDoubleQuotes,
} from '../../../../helpers/util.helper';
import { FilterType } from '../../../../models/filters/filter.model';
import { NodeLabelTag } from '../../../../models/node-label-tag.type';
import { LabelsCacheService } from '../../../../services/cache/labels-cache.service';
import { DetailsService } from '../../../../services/details.service';
import { FilterService } from '../../../../services/search/filter.service';
import { SearchService } from '../../../../services/search/search.service';
import { ScrollService } from '../../../../services/ui/scroll.service';
import { UrlService } from '../../../../services/url.service';
import { NodeLabelComponent } from '../node-label/node-label.component';

@Component({
  selector: 'app-node-link',
  imports: [RouterLink, NodeLabelComponent],
  templateUrl: './node-link.component.html',
  styleUrl: './node-link.component.scss',
})
export class NodeLinkComponent implements OnInit, OnChanges {
  @ViewChild('linkElem') linkElem?: ElementRef;

  @Input() url?: string;
  processedUrl?: string = this.url;

  @Input() label?: string;
  @Input() labelUrl?: string;
  @Input() disabled?: boolean;
  @Input() shouldTruncate = true;
  @Input() allowLabelExpand = true;
  @Input() suffixStr = '';
  @Input() shouldHighlight = true;
  @Input() tag: NodeLabelTag = 'span';

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  isClickableUrl = false;
  isInternalUrl = false;

  constructor(
    public cache: LabelsCacheService,
    public filters: FilterService,
    public search: SearchService,
    public urlService: UrlService,
    public scroll: ScrollService,
    public details: DetailsService,
  ) {}

  ngOnInit() {
    if (!this.labelUrl) {
      this.labelUrl = this.url;
    }

    this.processUrl().then(() => {
      this.initIsInternalUrl();
      const isValidAbsoluteUrl =
        this.processedUrl !== undefined && isValidUrl(this.processedUrl);
      this.isClickableUrl =
        (this.isInternalUrl || isValidAbsoluteUrl) && !this.disabled;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      this.processUrl();
    }
  }

  initIsInternalUrl() {
    if (!this.processedUrl) {
      return;
    }
    this.isInternalUrl = this.processedUrl.startsWith('/');
  }

  async processUrl() {
    if (!this.url) {
      return;
    }

    this.processedUrl = await this.urlService.processUrl(this.url);
  }

  get cachedLabel(): string | undefined {
    if (this.label) {
      return this.label;
    }

    if (this?.labelUrl && isValidHttpUrl(this.labelUrl)) {
      void this.cache.cacheLabelForId(this.labelUrl);
      return this.cache.labels.value?.[this.labelUrl];
    }

    return this.processedUrl ? replacePrefixes(this.processedUrl) : undefined;
  }

  onUrlClicked(event: MouseEvent) {
    this.clicked.emit(event);

    if (!this.processedUrl || !this.isClickableUrl || this.disabled) {
      this._preventDefault(event);
      return;
    }
  }

  onInternalUrlClicked() {
    const closestScrollId = this.getClosestScrollId();
    this.scroll.saveLastClickedScrollId(closestScrollId);
  }

  getClosestScrollId(): string {
    const closestElement =
      this.linkElem?.nativeElement.closest('[data-scroll-id]');
    if (closestElement) {
      return closestElement.getAttribute('data-scroll-id') || '';
    }
    return '';
  }

  private _preventDefault(event: MouseEvent) {
    event.preventDefault();
  }

  protected readonly featherFilter = featherFilter;
  protected readonly featherExternalLink = featherExternalLink;
  protected readonly featherX = featherX;
  protected readonly featherMaximize2 = featherMaximize2;
  protected readonly FilterType = FilterType;
  protected readonly featherSearch = featherSearch;
  protected readonly wrapWithDoubleQuotes = wrapWithDoubleQuotes;
}
