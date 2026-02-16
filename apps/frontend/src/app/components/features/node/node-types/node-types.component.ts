import { Component, Input } from '@angular/core';
import { Settings } from '../../../../config/settings';
import { intersects } from '../../../../helpers/util.helper';
import { ClusterValuesSettings } from '../../../../models/settings/cluster-values-settings.model';
import { PredicateVisibility } from '../../../../models/settings/predicate-visibility-settings.model';
import { TypeModel } from '../../../../models/type.model';
import { ClusterService } from '../../../../services/cluster.service';
import { PredicateVisibilityService } from '../../../../services/predicate-visibility.service';
import { SettingsService } from '../../../../services/settings.service';
import { NodeTypeComponent } from './node-type/node-type.component';

@Component({
  selector: 'app-node-types',
  imports: [NodeTypeComponent],
  templateUrl: './node-types.component.html',
  styleUrl: './node-types.component.scss',
})
export class NodeTypesComponent {
  @Input() types?: TypeModel[];
  typesClusteredInFilters: TypeModel[] = [];
  clusteredTypes: TypeModel[] = [];

  constructor(
    public clusters: ClusterService,
    public settings: SettingsService,
    public predVisibility: PredicateVisibilityService,
  ) {}

  ngOnInit() {
    this.initTypesClusteredInFilters();
    this.initClusteredTypes();
  }

  getVisibleTypes(): TypeModel[] {
    if (!this.types) {
      return [];
    }

    return this.types?.filter(
      (t) =>
        this.predVisibility.getVisibility(t.id) !== PredicateVisibility.Hide &&
        !(Settings.predicateVisibility.hideTypeBadges as string[]).includes(
          t.id,
        ),
    );
  }

  initTypesClusteredInFilters() {
    if (!this.types) {
      return;
    }

    this.typesClusteredInFilters = [];
    const typeIds = this.getVisibleTypes().map((t) => t.id);

    for (const [clusterId, filterCluster] of Object.entries(
      Settings.clustering.filterOptionValues as ClusterValuesSettings,
    )) {
      const typesAreClustered = intersects(typeIds, filterCluster.valueIds);
      if (typesAreClustered) {
        this.typesClusteredInFilters.push({
          id: clusterId,
          label: filterCluster.label,
        });
      }
    }
  }

  initClusteredTypes() {
    if (!this.types) {
      return;
    }

    this.clusteredTypes = this.clusters.clusterTypes(
      this.getVisibleTypes(),
      Settings.clustering.types,
    );
  }
}
