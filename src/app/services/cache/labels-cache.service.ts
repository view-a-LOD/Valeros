import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../../config/settings';
import { replacePrefixes } from '../../helpers/util.helper';
import { SparqlService } from '../sparql.service';

@Injectable({
  providedIn: 'root',
})
export class LabelsCacheService {
  private _idsToCacheLabelFor: Set<string> = new Set();
  private _labelsBeingCachedForIds: Set<string> = new Set();
  labels: BehaviorSubject<{ [id: string]: string }> = new BehaviorSubject({});

  constructor(public sparql: SparqlService) {
    void this._scheduleBatchCacheRequests();
  }

  async _scheduleBatchCacheRequests() {
    setInterval(
      () => this.cacheQueuedLabelsInBatch(),
      Settings.ui.labelFetchIntervalMs,
    );
  }

  async cacheQueuedLabelsInBatch() {
    const idsWithoutLabel: string[] = Array.from(
      this._idsToCacheLabelFor,
    ).filter((id) => {
      const labelAlreadyDefined = Object.keys(this.labels.value).includes(id);
      const alreadyRetrievingLabel = this._labelsBeingCachedForIds.has(id);
      return !labelAlreadyDefined && !alreadyRetrievingLabel;
    });

    if (!idsWithoutLabel || idsWithoutLabel.length === 0) {
      return;
    }

    idsWithoutLabel.map((id) => {
      this._labelsBeingCachedForIds.add(id);

      // While loading, set label based on ID as a fallback (also in case no label is retrieved)
      const labelAlreadyDefined = id in this.labels.value;
      if (!labelAlreadyDefined) {
        this.labels.next({ ...this.labels.value, [id]: replacePrefixes(id) });
      }
    });

    const idsAndLabels = await this.sparql.getLabels(idsWithoutLabel);

    for (const idAndLabel of idsAndLabels) {
      const id = idAndLabel['@id'];
      this.labels.next({ ...this.labels.value, [id]: idAndLabel.label });

      this._labelsBeingCachedForIds.delete(id);
    }
  }

  async cacheLabelForId(id: string): Promise<string> {
    if (!id) {
      return 'N/A';
    }
    this._idsToCacheLabelFor.add(id);

    return this.labels.value?.[id] ?? replacePrefixes(id);
  }
}
