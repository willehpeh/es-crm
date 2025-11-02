import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContactsApi } from '../services/contacts.api';
import * as ContactsActions from './contacts.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class ContactsEffects {
  private actions$ = inject(Actions);
  private contactsApi = inject(ContactsApi);

  loadContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactsActions.RegisterNewContact),
      switchMap(({ firstName, lastName, source }) =>
        this.contactsApi.registerNewContact({ firstName, lastName, source }).pipe(
          map((res) => ContactsActions.RegisterNewContactSuccess(res)),
          catchError((error) =>
            of(ContactsActions.RegisterNewContactFailure({ error }))
          )
        )
      )
    )
  );
}
