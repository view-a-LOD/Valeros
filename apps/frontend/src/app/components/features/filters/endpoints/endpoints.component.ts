import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../config/settings';
import { EndpointService } from '../../../../services/endpoint.service';
import { FilterService } from '../../../../services/search/filter.service';
import { SearchService } from '../../../../services/search/search.service';
import { UiService } from '../../../../services/ui/ui.service';
import { FilterEnabledCountComponent } from '../filter-options/filter-enabled-count/filter-enabled-count.component';

@Component({
  selector: 'app-endpoints',
  imports: [FilterEnabledCountComponent, FormsModule, TranslatePipe],
  templateUrl: './endpoints.component.html',
  styleUrl: './endpoints.component.scss',
})
export class EndpointsComponent {
  constructor(
    public endpoints: EndpointService,
    public filters: FilterService,
    public search: SearchService,
    public ui: UiService,
  ) {}

  get visibleEndpointIds(): string[] {
    return Object.keys(Settings.endpoints.data).filter(
      (endpointId) => !Settings.endpoints.data[endpointId]?.hideInFilter,
    );
  }

  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
