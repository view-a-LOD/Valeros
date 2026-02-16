import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { intersects } from '../helpers/util.helper';
import { FilterOptionValueModel } from '../models/filters/filter-option.model';
import { ClusterValuesSettings } from '../models/settings/cluster-values-settings.model';
import { TypeModel } from '../models/type.model';

@Injectable({
  providedIn: 'root',
})
export class ClusterService {
  constructor() {}

  // TODO: Reduce overlap between cluster functions in this file, create generic cluster function?
  clusterFilterOptionValues(
    filterOptionValues: FilterOptionValueModel[],
  ): FilterOptionValueModel[] {
    if (Object.keys(Settings.clustering.filterOptionValues).length === 0) {
      return filterOptionValues;
    }

    const clusteredFilterOptionValues: {
      [clusterId: string]: FilterOptionValueModel;
    } = {};

    const allValueIdsToCluster = Object.values(
      Settings.clustering.filterOptionValues as ClusterValuesSettings,
    ).flatMap((v) => v.valueIds);
    const nonClusteredFilterOptionValues: FilterOptionValueModel[] =
      filterOptionValues.filter(
        (optionValue) => !intersects(optionValue.ids, allValueIdsToCluster),
      );

    for (const [clusterId, clusterSettings] of Object.entries(
      Settings.clustering.filterOptionValues as ClusterValuesSettings,
    )) {
      let clusterFilterOptionValue: FilterOptionValueModel = {
        ids: [],
        label: clusterSettings.label,
        filterHitIds: [],
        filterHitCount: 0,
      };
      const existingClusterFilterOptionValue =
        clusteredFilterOptionValues[clusterId];
      if (existingClusterFilterOptionValue) {
        clusterFilterOptionValue = existingClusterFilterOptionValue;
      }

      for (const filterOptionValue of filterOptionValues) {
        const shouldBeClustered =
          filterOptionValue.ids.filter((id) =>
            clusterSettings.valueIds.includes(id),
          ).length > 0;
        if (shouldBeClustered) {
          clusterFilterOptionValue.ids = [
            ...new Set([
              ...clusterFilterOptionValue.ids,
              ...clusterSettings.valueIds,
              ...filterOptionValue.ids,
            ]),
          ];

          const uniqueFilterHitIds = Array.from(
            new Set(
              clusterFilterOptionValue.filterHitIds.concat(
                filterOptionValue.filterHitIds,
              ),
            ),
          );
          clusterFilterOptionValue.filterHitIds = uniqueFilterHitIds;
          clusterFilterOptionValue.filterHitCount = uniqueFilterHitIds.length;

          clusteredFilterOptionValues[clusterId] = clusterFilterOptionValue;
        }
      }
    }

    const allFilterOptionValues = [
      ...Object.values(clusteredFilterOptionValues),
      ...nonClusteredFilterOptionValues,
    ];
    const sortedFilterOptionValues = allFilterOptionValues.sort(
      (a, b) => b.filterHitCount - a.filterHitCount,
    );
    return sortedFilterOptionValues;
  }

  clusterTypes(
    types: TypeModel[],
    clusters: ClusterValuesSettings,
  ): TypeModel[] {
    if (Object.keys(clusters).length === 0) {
      return types;
    }

    const clusteredTypes: { [clusterId: string]: TypeModel } = {};
    const nonClusteredTypes: TypeModel[] = [];
    const processedTypes = new Set<string>();

    for (const [clusterId, cluster] of Object.entries(clusters)) {
      const typesToBeClustered = types.filter((type) =>
        cluster.valueIds.includes(type.id),
      );

      if (typesToBeClustered.length > 0) {
        const clusteredType = {
          id: clusterId,
          label: cluster.label,
        };
        clusteredTypes[clusterId] = clusteredType;
        typesToBeClustered.forEach((type) => processedTypes.add(type.id));
      }
    }

    types.forEach((type) => {
      if (!processedTypes.has(type.id)) {
        nonClusteredTypes.push(type);
      }
    });

    return [...nonClusteredTypes, ...Object.values(clusteredTypes)];
  }
}
