import { createAction, props } from '@ngrx/store';
import { AppError } from '../../core/types/error';

export const RegisterNewContact = createAction(
  '[New Contact Form] Register New Contact',
  props<{ firstName: string, lastName: string, source: string }>()
);

export const RegisterNewContactSuccess = createAction(
  '[Contacts API] Register New Contact Success',
  props<{ id: string }>()
);

export const RegisterNewContactFailure = createAction(
  '[Contacts API] Register New Contact Failure',
  props<{ error: AppError }>()
);
