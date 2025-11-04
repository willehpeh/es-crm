import { Contact, ContactId, ContactRepository, DomainEvent, NewContactRegistered, StoredEvent } from '@es-crm/domain';
import { Injectable } from '@nestjs/common';
import { EventStore } from '../event-store';

@Injectable()
export class EventStoreContactRepository implements ContactRepository {

  constructor(private readonly eventStore: EventStore) {}

  async register(contact: Contact, contactId: ContactId): Promise<{ id: string }> {
    const events = contact.uncommittedEvents();
    await this.eventStore.append(this.enrichEvents(events, contactId.value(), 0));
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

  private enrichEvents(events: DomainEvent[], streamId: string, startingFromPosition: number): StoredEvent[] {
    return events.map((event, index) => this.enrichEvent(event, streamId, startingFromPosition + index));
  }
}
