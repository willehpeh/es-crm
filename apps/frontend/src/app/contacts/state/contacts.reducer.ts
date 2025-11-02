import { AppError } from '../../core/types/error';
import { createReducer, on } from '@ngrx/store';
import * as ContactsActions from './contacts.actions';

export const featureKey = 'contacts';

export interface ContactsState {
  loading: boolean;
  error: AppError | null;
}

export const initialState: ContactsState = {
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(ContactsActions.RegisterNewContact, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ContactsActions.RegisterNewContactSuccess, state => ({
    ...state,
    loading: false,
    error: null
  })),
  on(ContactsActions.RegisterNewContactFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  })),
);
