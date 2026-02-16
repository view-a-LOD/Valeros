import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherChevronRight } from '@ng-icons/feather-icons';
import { HopLinkSettings } from '../../../../../../../models/settings/hop-link-settings.model';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';

@Component({
  selector: 'app-hop-trail',
  imports: [NodeLinkComponent, NgIcon],
  templateUrl: './hop-trail.component.html',
  styleUrl: './hop-trail.component.scss',
})
export class HopTrailComponent {
  @Input() settings?: HopLinkSettings;

  protected readonly featherChevronRight = featherChevronRight;
}
