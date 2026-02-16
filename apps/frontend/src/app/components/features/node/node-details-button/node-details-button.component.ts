import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherArrowRight } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { NodeModel } from '../../../../models/node.model';
import { DetailsService } from '../../../../services/details.service';
import { NodeService } from '../../../../services/node/node.service';

@Component({
  selector: 'app-node-details-button',
  imports: [NgIcon, RouterLink, TranslatePipe],
  templateUrl: './node-details-button.component.html',
  styleUrl: './node-details-button.component.scss',
})
export class NodeDetailsButtonComponent {
  @Input() node: NodeModel | undefined;

  constructor(
    public details: DetailsService,
    public nodes: NodeService,
  ) {}
  protected readonly featherArrowRight = featherArrowRight;
  protected readonly encodeURIComponent = encodeURIComponent;
}
