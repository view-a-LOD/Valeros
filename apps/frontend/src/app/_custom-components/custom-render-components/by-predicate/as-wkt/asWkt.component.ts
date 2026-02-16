import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { LeafletService } from '../../../../services/leaflet.service';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-as-wkt',
  standalone: true,
  imports: [],
  templateUrl: './asWkt.component.html',
  styleUrl: './asWkt.component.scss',
})
export class AsWktComponent
  extends PredicateRenderComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private map: L.Map | null = null;
  private polygonLayer: L.Polygon | null = null;

  constructor(
    private ngZone: NgZone,
    private leafletService: LeafletService,
  ) {
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

    this.map = this.leafletService.initMap(
      this.mapContainer,
      [51.995, 5.167],
      13,
    );

    this.addPolygonFromData();
  }

  private addPolygonFromData(): void {
    if (!this.data?.value || !this.map) {
      return;
    }

    try {
      this.polygonLayer = this.leafletService.addPolygonFromWkt(
        this.map,
        this.data.value,
      );
    } catch (error) {
      console.error('Error parsing polygon data:', error);
    }
  }
}
