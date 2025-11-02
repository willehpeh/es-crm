import { createAction, props } from '@ngrx/store';
import { AppError } from '../../core/types/error';
import { RegisterNewContactDto } from '../dtos/register-new-contact.dto';

export const RegisterNewContact = createAction(
  '[New Contact Form] Register New Contact',
  props<{ dto: RegisterNewContactDto }>()
);

export const RegisterNewContactSuccess = createAction(
  '[Contacts API] Register New Contact Success',
  props<{ id: string }>()
);

export const RegisterNewContactFailure = createAction(
  '[Contacts API] Register New Contact Failure',
  props<{ error: AppError }>()
);
