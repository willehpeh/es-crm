import { Contact, ContactId, ContactRepository, DomainEvent, NewContactRegistered, StoredEvent } from '@es-crm/domain';
import { Injectable } from '@nestjs/common';
import { EventStore } from '../event-store';

@Injectable()
export class EventStoreContactRepository implements ContactRepository {

  constructor(private readonly eventStore: EventStore) {}

  async register(contact: Contact): Promise<ContactId> {
    const events = contact.uncommittedEvents();
    const registerEvent = events[0] as NewContactRegistered;
    const contactId = registerEvent.payload.contactId;
    await this.eventStore.append(this.enrichEvents(events, contactId.value(), contact.baseVersion()));
    return contactId;
  }

  private enrichEvents(events: DomainEvent[], streamId: string, startingFromPosition: number): StoredEvent[] {
    return events.map((event, index) => ({
      id: crypto.randomUUID(),
      type: event.type,
      payload: event.payload,
      streamId,
      created: new Date().toISOString(),
      metadata: {},
      streamPosition: startingFromPosition + index + 1,
    }));
  }
}
