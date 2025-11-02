import { createFeatureSelector } from '@ngrx/store';
import * as fromContacts from './contacts.reducer';
import { ContactsState } from './contacts.reducer';

export const selectContactsState = createFeatureSelector<ContactsState>(fromContacts.featureKey);
