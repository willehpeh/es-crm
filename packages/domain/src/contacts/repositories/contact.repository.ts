import { Contact } from '../index';

export abstract class ContactRepository {
  abstract register(contact: Contact): Promise<{ id: string }>;
}
