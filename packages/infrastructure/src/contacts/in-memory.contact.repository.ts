import { Contact, ContactRepository, DomainEvent, NewContactRegistered } from '@es-crm/domain';

export class InMemoryContactRepository implements ContactRepository {
  events: DomainEvent[] = [];

  async register(contact: Contact): Promise<{ id: string }> {
    this.events.push(...contact.uncommittedEvents());
    const event = contact.uncommittedEvents()[0] as NewContactRegistered;
    return { id: event.payload.contactId };
  }
}
