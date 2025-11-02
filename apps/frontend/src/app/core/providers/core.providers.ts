import {
  EnvironmentProviders, makeEnvironmentProviders,
  provideBrowserGlobalErrorListeners, provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from '../../app.routes';
import { provideHttpClient } from '@angular/common/http';

export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient()
  ]);
}
