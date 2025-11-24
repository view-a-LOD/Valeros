import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { NodeLinkComponent } from '../../../features/node/node-link/node-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-as-wkt',
  standalone: true,
  imports: [NodeLinkComponent, JsonPipe],
  templateUrl: './asWkt.component.html',
  styleUrl: './asWkt.component.scss',
})
export class AsWktComponent
  extends PredicateRenderComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private map: L.Map | null = null;

  constructor(private ngZone: NgZone) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initMap();
    });
  }

  private initMap(): void {
    if (!this.mapContainer) {
      console.error('Map container not found');
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [51.505, -0.09],
      13,
    );

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png',
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(this.map);
  }
}
