import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faSolidSitemap } from '@ng-icons/font-awesome/solid';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-intro-below-search',
  imports: [TranslatePipe],
  templateUrl: './home-intro-below-search.component.html',
  styleUrl: './home-intro-below-search.component.scss',
})
export class HomeIntroBelowSearchComponent {
  constructor(public router: Router) {}

  protected readonly faSolidSitemap = faSolidSitemap;
}
