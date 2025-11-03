import {
  Contact,
  ContactId,
  ContactRepository,
  DomainEvent,
  NewContactRegistered,
} from '@es-crm/domain';

export class InMemoryContactRepository implements ContactRepository {
  events: DomainEvent[] = [];

  async register(contact: Contact): Promise<ContactId> {
    this.events.push(...contact.uncommittedEvents());
    const event = contact.uncommittedEvents()[0] as NewContactRegistered;
    return event.payload.contactId;
  }
}
