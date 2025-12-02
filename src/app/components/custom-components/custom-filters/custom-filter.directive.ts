import { Directive, inject, Input, OnInit } from '@angular/core';
import { CustomFilterService } from './custom-filter.service';
import { CustomFiltersRegistry } from './custom-filters.registry';

@Directive()
export abstract class CustomFilterComponent implements OnInit {
  @Input() filterId?: string;
  @Input() fieldIds?: string[];
  @Input() service?: CustomFilterService;

  customFiltersRegistry = inject(CustomFiltersRegistry);

  constructor() {}

  ngOnInit() {
    this._registerFilter();
  }

  private _registerFilter() {
    if (!this.filterId) {
      console.warn('No filterId provided for custom filter');
      return;
    }
    if (!this.service) {
      console.warn('No service provided for custom filter');
      return;
    }
    this.customFiltersRegistry.register(this.filterId, this.service);
  }
}
