import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NodeModel } from '../../models/node.model';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { DetailsService } from '../details.service';
import { SettingsService } from '../settings.service';
import { SparqlService } from '../sparql.service';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root',
})
export class NodeSectionService {
  constructor(
    private sparql: SparqlService,
    private settings: SettingsService,
    private details: DetailsService,
    private nodes: NodeService,
  ) {}

  shouldShowSectionNextToTable(
    files: string[],
    canShowUsingFileRenderer: boolean,
    shouldShowIIIF$: Observable<boolean>,
  ): Observable<boolean> {
    return combineLatest([
      shouldShowIIIF$,
      of(this.shouldShowFileNextToTable(files, canShowUsingFileRenderer)),
    ]).pipe(
      map(
        ([shouldShowIIIF, shouldShowFile]: [boolean, boolean]) =>
          shouldShowIIIF || shouldShowFile,
      ),
    );
  }

  async checkShouldShowIIIF(
    node: NodeModel | undefined,
    files: string[],
    canShowUsingFileRenderer: boolean,
  ): Promise<boolean> {
    if (
      !node ||
      this.shouldShowFileNextToTable(files, canShowUsingFileRenderer) ||
      !this.details.isShowing()
    ) {
      return false;
    }

    const nodeId = this.nodes.getId(node);
    return await this.sparql.shouldShowIIIF(nodeId);
  }

  shouldShowFileNextToTable(
    files: string[],
    canShowUsingFileRenderer: boolean,
  ): boolean {
    const hasFiles =
      this.settings.hasViewModeSetting(ViewModeSetting.ShowFileNextToTable) &&
      files &&
      files.length > 0;

    if (!hasFiles) {
      return false;
    }

    const isShowingDetails = this.details.showing.value;
    if (!isShowingDetails || (isShowingDetails && canShowUsingFileRenderer)) {
      return true;
    }
    return false;
  }
}
