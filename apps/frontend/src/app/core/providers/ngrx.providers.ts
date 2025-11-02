import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export function provideNgrx(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideStore(),
    provideEffects(),
    provideStoreDevtools({
      maxAge: 25,
    }),
  ])
}
