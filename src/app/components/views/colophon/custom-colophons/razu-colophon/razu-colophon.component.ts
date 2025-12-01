import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HeaderComponent } from '../../../../ui/header/header.component';
import { ViewContainerComponent } from '../../../view-container/view-container.component';
import { CustomColophonComponent } from '../custom-colophon.directive';

@Component({
  selector: 'app-razu-colophon',
  imports: [HeaderComponent, ViewContainerComponent, TranslatePipe, RouterLink],
  templateUrl: './razu-colophon.component.html',
  styleUrl: './razu-colophon.component.scss',
})
export class RazuColophonComponent extends CustomColophonComponent {}
