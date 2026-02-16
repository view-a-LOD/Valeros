import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TypeModel } from '../../../../../models/type.model';
import { NodeLinkComponent } from '../../node-link/node-link.component';

@Component({
  selector: 'app-node-type',
  imports: [NodeLinkComponent, NgClass],
  templateUrl: './node-type.component.html',
  styleUrl: './node-type.component.scss',
})
export class NodeTypeComponent {
  @Input() showNeutralColors = false;
  @Input() type?: TypeModel;
}
