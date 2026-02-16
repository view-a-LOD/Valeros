import { ElementRef, Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({ providedIn: 'root' })
export class LeafletService {
  private defaultMarkerIcon: L.Icon;

  constructor() {
    this.defaultMarkerIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }

  initMap(
    container: ElementRef,
    center: L.LatLngExpression,
    zoom: number,
  ): L.Map {
    const map = L.map(container.nativeElement).setView(center, zoom);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      },
    ).addTo(map);

    return map;
  }

  addPolygonFromWkt(map: L.Map, wktString: string): L.Polygon | null {
    const coordinates = this.parseWKT(wktString);
    if (coordinates.length === 0) {
      return null;
    }

    const polygon = L.polygon(coordinates, {
      color: '#3388ff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.3,
    }).addTo(map);

    // map.fitBounds(polygon.getBounds());

    const bounds = polygon.getBounds();
    const center = bounds.getCenter();
    map.setView(center, 17);

    return polygon;
  }

  addMarker(map: L.Map, position: L.LatLngExpression): L.Marker {
    return L.marker(position, { icon: this.defaultMarkerIcon }).addTo(map);
  }

  private parseWKT(wktString: string): L.LatLngExpression[] {
    const polygonMatch = wktString.match(/POLYGON\s*\(\((.*?)\)\)/i);
    if (!polygonMatch) {
      throw new Error('Invalid POLYGON format');
    }

    const coordinatesText = polygonMatch[1];
    const coordinatePairs = coordinatesText.split(',');

    return coordinatePairs.map((pair) => {
      const [lng, lat] = pair.trim().split(/\s+/).map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinate values');
      }
      return [lat, lng] as L.LatLngExpression;
    });
  }
}
