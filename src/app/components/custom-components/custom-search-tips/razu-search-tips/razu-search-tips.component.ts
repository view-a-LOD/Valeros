import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchTipInputComponent } from '../../search-tip-input/search-tip-input.component';
import { SearchTipComponent } from '../../search-tip/search-tip.component';
import { CustomSearchTipsComponent } from '../custom-search-tips.directive';

@Component({
  selector: 'app-razu-search-tips',
  standalone: true,
  imports: [TranslatePipe, SearchTipInputComponent, SearchTipComponent],
  templateUrl: './razu-search-tips.component.html',
})
export class RazuSearchTipsComponent extends CustomSearchTipsComponent {}
