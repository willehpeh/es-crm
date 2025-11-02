import { inject, Injectable } from '@angular/core';
import { ContactsFacade } from './contacts.facade';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NgrxContactsFacade implements ContactsFacade {

  private http = inject(HttpClient);

  registerNewContact(props: { firstName: string; lastName: string; source: string }): void {
    this.http.post('/api/contacts', props).subscribe();
  }

}
