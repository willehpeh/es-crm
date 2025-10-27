import { Contact, ContactId } from './';

export interface ContactRepository {
  register(contact: Contact): ContactId;
}
