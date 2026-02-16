import { Component, OnInit } from '@angular/core';
import { featherChevronDown, featherChevronUp } from '@ng-icons/feather-icons';
import { PredicateVisibility } from '../../../../../models/settings/predicate-visibility-settings.model';
import { ViewModeSetting } from '../../../../../models/settings/view-mode-setting.enum';
import { ViewMode } from '../../../../../models/view-mode.enum';
import { DetailsService } from '../../../../../services/details.service';
import { NodeService } from '../../../../../services/node/node.service';
import { PredicateVisibilityService } from '../../../../../services/predicate-visibility.service';
import { SettingsService } from '../../../../../services/settings.service';
import { NodeRenderComponent } from '../node-render.component';
import { NodeTableComponent } from './node-table/node-table.component';

@Component({
  selector: 'app-node-table-view',
  imports: [NodeTableComponent],
  templateUrl: './node-table-view.component.html',
  styleUrl: './node-table-view.component.scss',
})
export class NodeTableViewComponent
  extends NodeRenderComponent
  implements OnInit
{
  canShowDetails = false;
  numOfDetailsPreds = 0;

  constructor(
    public settings: SettingsService,
    public override nodes: NodeService,
    public details: DetailsService,
    public predVisibility: PredicateVisibilityService,
  ) {
    super(nodes);
  }

  ngOnInit() {
    this.canShowDetails = this.settings.hasViewModeSetting(
      ViewModeSetting.ShowDetails,
    );
    this.numOfDetailsPreds = this._getNumOfPreds(PredicateVisibility.Details);
  }

  private _getNumOfPreds(visibility: PredicateVisibility): number {
    if (!this.node) {
      return 0;
    }

    const visiblePreds = Object.keys(
      Object.entries(this.node).filter(([pred, _]) => {
        return this.predVisibility.getVisibility(pred) === visibility;
      }),
    );
    return visiblePreds.length;
  }

  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly Object = Object;
  protected readonly ViewMode = ViewMode;
  protected readonly ViewModeSetting = ViewModeSetting;
  protected readonly featherChevronDown = featherChevronDown;
  protected readonly featherChevronUp = featherChevronUp;
}
