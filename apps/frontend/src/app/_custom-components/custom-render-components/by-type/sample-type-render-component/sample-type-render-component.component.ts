import { JsonPipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { TypeRenderComponent } from '../type-render-component.component';

@Component({
  selector: 'app-sample-type-render-component',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './sample-type-render-component.component.html',
  styleUrl: './sample-type-render-component.component.css',
})
export class SampleTypeRenderComponentComponent
  extends TypeRenderComponent
  implements OnInit
{
  ngOnInit(): void {}
}
