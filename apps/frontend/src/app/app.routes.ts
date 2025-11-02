import { Route } from '@angular/router';
import { provideContacts } from './contacts/providers/contacts.providers';

export const appRoutes: Route[] = [
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.routes').then(r => r.contactsRoutes),
    providers: [provideContacts()]
  }
];
