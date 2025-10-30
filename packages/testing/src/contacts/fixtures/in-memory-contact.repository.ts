import { ContactId, ContactRepository, StoredEvent } from '@es-crm/domain';

export class InMemoryContactRepository implements ContactRepository {
  events: StoredEvent[] = [];

  async register(): Promise<ContactId> {
    return new ContactId();
  }
}
