import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.routes').then(r => r.contactsRoutes) }
];
