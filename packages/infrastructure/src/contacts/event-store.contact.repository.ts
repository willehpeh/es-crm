import { Contact, ContactId, ContactRepository, DomainEvent, StoredEvent } from '@es-crm/domain';
import { Injectable } from '@nestjs/common';
import { EventStore } from '../event-store';

@Injectable()
export class EventStoreContactRepository implements ContactRepository {

  constructor(private readonly eventStore: EventStore) {}

  async register(contact: Contact, contactId: ContactId): Promise<{ id: string }> {
    const eventsToStore = this.enrichEvents(contact.uncommittedEvents(), contactId.value(), 0);
    await this.eventStore.append(eventsToStore);
    return { id: contactId.value() };
  }

  private enrichEvent(event: DomainEvent, streamId: string, expectedStreamPosition: number): StoredEvent {
    return {
      id: crypto.randomUUID(),
      type: event.type,
      payload: event.payload,
      streamId,
      created: new Date().toISOString(),
      metadata: {},
      streamPosition: expectedStreamPosition
    };
  }

  private enrichEvents(events: DomainEvent[], streamId: string, expectedStartPosition: number): StoredEvent[] {
    return events.map((event, index) => this.enrichEvent(event, streamId, expectedStartPosition + index));
  }
}
