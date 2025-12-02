import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideMatomo } from 'ngx-matomo-client';
import { routes } from './app.routes';
import { Settings } from './config/settings';
import { AutocompleteProvider } from './services/search/autocomplete-providers/autocomplete-provider.interface';
import { ElasticAutocompleteProvider } from './services/search/autocomplete-providers/elastic-autocomplete.provider';
import { ElasticSearchProvider } from './services/search/search-providers/elastic-search-provider/elastic-search.provider';
import { SearchProvider } from './services/search/search-providers/search-provider.interface';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) =>
  new TranslateHttpLoader(
    http,
    Settings.content.translations.basePath,
    Settings.content.translations.fileExtension,
  );

const providers = [
  provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
  provideAnimationsAsync(),
  provideHttpClient(),
  importProvidersFrom([
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ]),
  { provide: SearchProvider, useExisting: ElasticSearchProvider },
  { provide: AutocompleteProvider, useExisting: ElasticAutocompleteProvider },
];

if (Settings.matomo && Settings.matomo.siteId && Settings.matomo.trackerUrl) {
  console.log('Matomo settings:', Settings.matomo);
  providers.push(
    provideMatomo({
      siteId: Settings.matomo.siteId,
      trackerUrl: Settings.matomo.trackerUrl,
    }),
  );
}

export const appConfig: ApplicationConfig = {
  providers: providers,
};
