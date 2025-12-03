import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { HopLinkComponent } from '../../../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { LeafletService } from '../../../../services/leaflet.service';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

@Component({
  selector: 'app-schema-geo',
  standalone: true,
  imports: [HopLinkComponent],
  templateUrl: './schema-geo.component.html',
})
export class SchemaGeoComponent
  extends PredicateRenderComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  latitude: string[] = [];
  longitude: string[] = [];
  polygon: string[] = [];

  private map: L.Map | null = null;
  private polygonLayer: L.Polygon | null = null;
  private marker: L.Marker | null = null;

  constructor(
    private ngZone: NgZone,
    private leafletService: LeafletService,
  ) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.tryInitOrUpdateMap();
    });
  }

  onLatitude(values: string[]): void {
    // TODO: Remove (temporary) flipping of lat/long
    // this.latitude = values;
    this.longitude = values;
    this.tryInitOrUpdateMap();
  }

  onLongitude(values: string[]): void {
    // TODO: Remove (temporary) flipping of lat/long
    this.latitude = values;
    // this.longitude = values;
    this.tryInitOrUpdateMap();
  }

  onPolygon(values: string[]): void {
    // this.polygon = values;

    // TODO: Remove (temporary) flipping of lat/long in polygon
    const raw = values[0] ?? '';
    const flipped = raw
      .split(' ')
      .map((pair) => {
        const [lngStr, latStr] = pair.split(',');
        const lat = Number(latStr);
        const lng = Number(lngStr);

        if (isNaN(lat) || isNaN(lng)) {
          return null;
        }

        return `${lng} ${lat}`;
      })
      .filter((p): p is string => p !== null)
      .join(', ');

    this.polygon = [flipped];
    this.tryInitOrUpdateMap();
  }

  private tryInitOrUpdateMap(): void {
    if (!this.mapContainer) {
      return;
    }

    if (this.polygon[0]) {
      this.updateMapForPolygon();
      return;
    }

    if (this.latitude[0] && this.longitude[0]) {
      this.updateMapForPoint();
    }
  }

  private ensureMapInitialized(center: L.LatLngExpression): void {
    if (!this.map) {
      this.map = this.leafletService.initMap(this.mapContainer, center, 16);
    }
  }

  private clearPolygonAndMarker(): void {
    if (this.marker) {
      this.map?.removeLayer(this.marker);
      this.marker = null;
    }

    if (this.polygonLayer) {
      this.map?.removeLayer(this.polygonLayer);
      this.polygonLayer = null;
    }
  }

  private updateMapForPolygon(): void {
    this.ensureMapInitialized([0, 0]);
    this.clearPolygonAndMarker();

    const wktPolygon = `POLYGON((${this.polygon[0]}))`;
    this.polygonLayer = this.leafletService.addPolygonFromWkt(
      this.map!,
      wktPolygon,
    );
  }

  private updateMapForPoint(): void {
    const lat = Number(this.latitude[0]);
    const lng = Number(this.longitude[0]);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    this.ensureMapInitialized([lat, lng]);

    if (this.map) {
      this.map.setView([lat, lng], this.map.getZoom());
    }

    if (this.polygonLayer) {
      this.map?.removeLayer(this.polygonLayer);
      this.polygonLayer = null;
    }

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else if (this.map) {
      this.marker = this.leafletService.addMarker(this.map, [lat, lng]);
    }
  }
}
