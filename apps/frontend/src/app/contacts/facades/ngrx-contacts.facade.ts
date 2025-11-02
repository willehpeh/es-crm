import { inject, Injectable } from '@angular/core';
import { ContactsFacade } from './contacts.facade';
import { HttpClient } from '@angular/common/http';
import { ContactsApi } from '../services/contacts.api';

@Injectable()
export class NgrxContactsFacade implements ContactsFacade {

  private contacts = inject(ContactsApi);

  registerNewContact(props: { firstName: string; lastName: string; source: string }): void {
    this.contacts.registerNewContact(props).subscribe();
  }

}
