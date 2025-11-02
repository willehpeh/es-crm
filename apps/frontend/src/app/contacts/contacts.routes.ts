import { Routes } from '@angular/router';

export const contactsRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/new-contact-form').then(c => c.NewContactForm) },
];
