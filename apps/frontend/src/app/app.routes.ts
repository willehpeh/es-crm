import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import * as fromContacts from './contacts/state/contacts.reducer';
import { provideEffects } from '@ngrx/effects';
import { ContactsEffects } from './contacts/state/contacts.effects';
import { ContactsApi } from './contacts/services/contacts.api';
import { ContactsFacade } from './contacts/facades/contacts.facade';
import { NgrxContactsFacade } from './contacts/facades/ngrx-contacts.facade';

export const appRoutes: Route[] = [
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.routes').then(r => r.contactsRoutes),
    providers: [
      provideState(fromContacts.featureKey, fromContacts.reducer),
      provideEffects([ContactsEffects]),
      ContactsApi,
      { provide: ContactsFacade, useClass: NgrxContactsFacade }
    ]
  }
];
