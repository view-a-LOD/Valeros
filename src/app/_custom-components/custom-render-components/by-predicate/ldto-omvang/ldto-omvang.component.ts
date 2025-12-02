import { Component, OnInit } from '@angular/core';
import { humanFileSize } from '../../../../helpers/util.helper';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-ldto-omvang',
  imports: [],
  templateUrl: './ldto-omvang.component.html',
  styleUrl: './ldto-omvang.component.scss',
})
export class LdtoOmvangComponent
  extends PredicateRenderComponent
  implements OnInit
{
  bytesStr?: string;
  humanReadableBytesStr: string = '';

  ngOnInit() {
    this.bytesStr = this.data?.['value'];
    this.initHumanReadableBytesStr();
  }

  initHumanReadableBytesStr() {
    if (!this.bytesStr) {
      this.humanReadableBytesStr = this.bytesStr ?? '';
      return;
    }

    const bytes: number = parseInt(this.bytesStr);
    this.humanReadableBytesStr = humanFileSize(bytes, true, 2);
  }
}
