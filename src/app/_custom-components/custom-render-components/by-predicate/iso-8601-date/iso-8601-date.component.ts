import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-iso-8601-date',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './iso-8601-date.component.html',
})
export class Iso8601DateComponent
  extends PredicateRenderComponent
  implements OnInit
{
  ngOnInit(): void {}
}
