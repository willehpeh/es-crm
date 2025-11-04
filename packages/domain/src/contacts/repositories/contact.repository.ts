import { Contact, ContactId } from '../';

export abstract class ContactRepository {
  abstract register(contact: Contact, contactId: ContactId): Promise<{ id: string }>;
}
