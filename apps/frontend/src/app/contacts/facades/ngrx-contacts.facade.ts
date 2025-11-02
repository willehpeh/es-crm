import { inject, Injectable } from '@angular/core';
import { ContactsFacade } from './contacts.facade';
import { Store } from '@ngrx/store';
import * as ContactsActions from '../state/contacts.actions';
import { RegisterNewContactDto } from '../dtos/register-new-contact.dto';

@Injectable()
export class NgrxContactsFacade implements ContactsFacade {
  private store = inject(Store);

  registerNewContact(dto: RegisterNewContactDto): void {
    this.store.dispatch(ContactsActions.RegisterNewContact({ dto }));
  }
}
