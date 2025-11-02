import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ContactsApi {
  private readonly http = inject(HttpClient);

  registerNewContact(props: { firstName: string; lastName: string; source: string }): Observable<{ id: string }> {
    return this.http.post<{ id: string }>('/api/contacts', props);
  }
}
