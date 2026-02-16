import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { Settings } from '../config/settings';
import {
  EndpointModel,
  EndpointUrlsModel,
  EndpointsModel,
} from '../models/endpoint.model';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class EndpointService {
  enabledIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    public settings: SettingsService,
    private route: ActivatedRoute,
  ) {
    this._initUpdateEndpointsOnUrlChange();
  }

  getEndpointUrls(endpointId: string): EndpointUrlsModel[] | null {
    const endpoints: EndpointsModel = Settings.endpoints.data;
    if (!(endpointId in endpoints)) {
      console.warn(`${endpointId} endpoint not configured`);
      return null;
    }
    const endpoint = endpoints[endpointId] as EndpointModel;
    return endpoint.endpointUrls;
  }

  private _initUpdateEndpointsOnUrlChange() {
    void this.route.queryParams.pipe(take(1)).subscribe((queryParams) => {
      const endpointsParam: string | undefined =
        queryParams[Settings.url.params.endpoints];
      if (endpointsParam) {
        const endpointIds: string[] = endpointsParam.split(',');
        this.enabledIds.next(endpointIds);
      }
    });
  }

  getById(endpointId: string): EndpointModel | undefined {
    const endpoints: EndpointsModel = Settings.endpoints.data;
    return endpoints[endpointId] ?? undefined;
  }

  getIdBySparqlUrl(sparqlEndpointUrl: string): string {
    const endpoints: EndpointsModel = Settings.endpoints.data;

    for (const [endpointId, endpoint] of Object.entries(endpoints)) {
      const endpointMatchesUrl = endpoint.endpointUrls.some(
        (endpointUrl) => endpointUrl.sparql === sparqlEndpointUrl,
      );
      if (endpointMatchesUrl) {
        return endpointId;
      }
    }

    return '';
  }

  toggle(endpointId: string) {
    const enabledIds = this.enabledIds.value;
    const existingEndpointIdx = enabledIds.findIndex(
      (enabledEndpointId) => enabledEndpointId === endpointId,
    );
    const endpointIsAlreadyEnabled = existingEndpointIdx > -1;
    if (endpointIsAlreadyEnabled) {
      enabledIds.splice(existingEndpointIdx, 1);
    } else {
      enabledIds.push(endpointId);
    }
    this.enabledIds.next(enabledIds);
  }

  isEnabled(endpointId: string): boolean {
    return this.enabledIds.value.includes(endpointId);
  }

  getFirstUrls(): EndpointUrlsModel {
    return this.getAllEnabledUrls()[0];
  }

  getAllUrls(): EndpointUrlsModel[] {
    return Object.values(Settings.endpoints).flatMap(
      (endpoint) => endpoint.endpointUrls,
    );
  }

  getAllEnabled(): EndpointsModel {
    const all: [string, EndpointModel][] = Object.entries(
      Settings.endpoints.data,
    ).filter(([endpointId, _]) => {
      const noFilterEnabled =
        !this.enabledIds.value || this.enabledIds.value.length === 0;
      if (noFilterEnabled) {
        return true;
      }
      return this.isEnabled(endpointId);
    });

    return Object.fromEntries(all);
  }

  getAllEnabledUrls(): EndpointUrlsModel[] {
    const allUrls = Object.entries(this.getAllEnabled()).flatMap(
      ([endpointId, endpoint]) => {
        endpoint.endpointUrls.forEach((u) => (u.id = endpointId));
        return endpoint.endpointUrls;
      },
    );
    return allUrls;
  }
}
