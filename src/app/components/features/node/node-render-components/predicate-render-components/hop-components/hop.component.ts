import { Component, EventEmitter, Output } from '@angular/core';
import { HopLinkSettings } from '../../../../../../models/settings/hop-link-settings.model';
import { SparqlService } from '../../../../../../services/sparql.service';
import { PredicateRenderComponent } from '../../../../../custom-components/custom-render-components/by-predicate/predicate-render-component.directive';

@Component({
  selector: 'app-hop-component',
  imports: [],
  template: ``,
})
export class HopComponent extends PredicateRenderComponent {
  id?: string;
  settings?: HopLinkSettings;

  @Output() hopObjIdsRetrieved = new EventEmitter<string[]>();

  hopObjIds: string[] = [];
  loading = false;

  constructor(public sparql: SparqlService) {
    super();
  }

  ngOnInit() {
    this.id = this.data?.value;
    this.settings = this.data?.hopLinkSettings;
    void this.initObjIdsForHop();
  }

  async initObjIdsForHop() {
    if (!this.id || !this.settings?.preds) {
      return;
    }

    this.loading = true;
    this.hopObjIds = await this.sparql
      .getObjIds(this.id, this.settings?.preds)
      .finally(() => {
        this.loading = false;
      });

    this.hopObjIdsRetrieved.emit(this.hopObjIds);
  }

  get showHops(): boolean {
    if (!this.settings || this.settings.showHops === undefined) {
      return true;
    }
    return this.settings.showHops;
  }

  get hasHopHits(): boolean {
    return this.hopObjIds && this.hopObjIds.length > 0;
  }
}
