import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

registerLocaleData(localeNl);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
