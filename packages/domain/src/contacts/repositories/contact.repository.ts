import { Contact, ContactId } from '../index';

export abstract class ContactRepository {
  abstract register(contact: Contact): Promise<ContactId>;
}
