import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import * as fromContacts from '../state/contacts.reducer';
import { provideEffects } from '@ngrx/effects';
import { ContactsEffects } from '../state/contacts.effects';
import { ContactsApi } from '../services/contacts.api';
import { ContactsFacade } from '../facades/contacts.facade';
import { NgrxContactsFacade } from '../facades/ngrx-contacts.facade';

export function provideContacts(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(fromContacts.featureKey, fromContacts.reducer),
    provideEffects([ContactsEffects]),
    ContactsApi,
    { provide: ContactsFacade, useClass: NgrxContactsFacade }
  ]);
}
