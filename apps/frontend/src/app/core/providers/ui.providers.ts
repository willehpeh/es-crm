import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export function provideUi(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
  ]);
}
