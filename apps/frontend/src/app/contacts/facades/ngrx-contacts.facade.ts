import { inject, Injectable } from '@angular/core';
import { ContactsFacade } from './contacts.facade';
import { Store } from '@ngrx/store';
import * as ContactsActions from '../state/contacts.actions';

@Injectable()
export class NgrxContactsFacade implements ContactsFacade {
  private store = inject(Store);

  registerNewContact(props: {
    firstName: string;
    lastName: string;
    source: string;
  }): void {
    this.store.dispatch(ContactsActions.RegisterNewContact(props));
  }
}
