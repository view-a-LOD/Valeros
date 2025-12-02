import { JsonPipe, NgComponentOutlet } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../config/settings';
import { FilterType } from '../../../../models/filters/filter.model';
import { FilterService } from '../../../../services/search/filter.service';
import { SettingsService } from '../../../../services/settings.service';
import { UiService } from '../../../../services/ui/ui.service';
import { CustomFilterService } from '../../../custom-components/custom-filters/custom-filter.service';
import { CustomFiltersRegistry } from '../../../custom-components/custom-filters/custom-filters.registry';
import { EndpointsComponent } from '../endpoints/endpoints.component';
import { FilterEnabledCountComponent } from './filter-enabled-count/filter-enabled-count.component';
import { FilterOptionComponent } from './filter-option/filter-option.component';

@Component({
  selector: 'app-filter-options',
  imports: [
    NgComponentOutlet,
    FilterOptionComponent,
    EndpointsComponent,
    FilterEnabledCountComponent,
    FormsModule,
    TranslatePipe,
    JsonPipe,
  ],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss',
})
export class FilterOptionsComponent {
  constructor(
    public filters: FilterService,
    public settings: SettingsService,
    public ui: UiService,
    private injector: Injector,
    public customFiltersRegistry: CustomFiltersRegistry,
  ) {}

  ngOnInit() {}

  protected readonly Object = Object;
  protected readonly FilterType = FilterType;
  protected readonly Settings = Settings;

  getCustomFilterService(serviceType: any): CustomFilterService | undefined {
    try {
      return this.injector.get(serviceType);
    } catch (error) {
      console.warn('Failed to inject custom filter service:', error);
      return undefined;
    }
  }

  clearFilters(): void {
    this.filters.toggleMultiple([...this.filters.enabled.value]);
    this.customFiltersRegistry.clearAll();
    this.filters.searchTrigger.emit({ clearFilters: true });
  }
}
