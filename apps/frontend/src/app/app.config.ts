import { ApplicationConfig } from '@angular/core';
import { provideNgrx } from './core/providers/ngrx.providers';
import { provideCore } from './core/providers/core.providers';
import { provideUi } from './core/providers/ui.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgrx(),
    provideCore(),
    provideUi(),
  ],
};
