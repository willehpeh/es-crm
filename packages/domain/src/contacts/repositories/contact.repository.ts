import { Contact, ContactId } from '../index';

export interface ContactRepository {
  register(contact: Contact): ContactId;
}
