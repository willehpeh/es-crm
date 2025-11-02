import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterNewContactDto } from '../dtos/register-new-contact.dto';

@Injectable()
export class ContactsApi {
  private readonly http = inject(HttpClient);

  registerNewContact(dto: RegisterNewContactDto): Observable<{ id: string }> {
    return this.http.post<{ id: string }>('/api/contacts', dto);
  }
}
