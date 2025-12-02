import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomColophonComponent } from '../custom-colophon.directive';

@Component({
  selector: 'app-razu-colophon',
  imports: [RouterLink],
  templateUrl: './razu-colophon.component.html',
  styleUrl: './razu-colophon.component.scss',
})
export class RazuColophonComponent extends CustomColophonComponent {}
