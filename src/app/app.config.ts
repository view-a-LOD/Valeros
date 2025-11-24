import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideMatomo } from 'ngx-matomo-client';
import { routes } from './app.routes';
import { Settings } from './config/settings';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient,
) =>
  new TranslateHttpLoader(
    http,
    Settings.ui.translations.basePath,
    Settings.ui.translations.fileExtension,
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
