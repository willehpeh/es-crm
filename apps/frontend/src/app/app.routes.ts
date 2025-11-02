import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import * as fromContacts from './contacts/state/contacts.reducer';
import { provideEffects } from '@ngrx/effects';
import { ContactsEffects } from './contacts/state/contacts.effects';

export const appRoutes: Route[] = [
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.routes').then(r => r.contactsRoutes),
    providers: [
      provideState(fromContacts.featureKey, fromContacts.reducer),
      provideEffects([ContactsEffects])
    ]
  }
];
