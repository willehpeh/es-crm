import { Contact, ContactId, ContactRepository, DomainEvent, StoredEvent } from '@es-crm/domain';
import { Injectable } from '@nestjs/common';
import { EventStore } from '../event-store';

@Injectable()
export class EventStoreContactRepository implements ContactRepository {

  constructor(private readonly eventStore: EventStore) {
  }

  async register(contact: Contact, contactId: ContactId): Promise<{ id: string }> {
    const eventsToStore = this.enrichEvents(contact.uncommittedEvents(), contactId.value(), 0);
    await this.eventStore.append(eventsToStore);
    return { id: contactId.value() };
  }

  private enrichEvent(event: DomainEvent, streamId: string, expectedStreamPosition: number): StoredEvent {
    return StoredEventBuilder
      .forStream(streamId)
      .ofType(event.type)
      .withPayload(event.payload)
      .atExpectedPosition(expectedStreamPosition)
      .withNoMetadata()
      .build();
  }

  private enrichEvents(events: DomainEvent[], streamId: string, expectedStartPosition: number): StoredEvent[] {
    return events.map((event, index) => this.enrichEvent(event, streamId, expectedStartPosition + index));
  }
}

class StoredEventBuilder {
  private readonly _streamId: string;
  private readonly _created: string;
  private _type?: string;
  private _payload?: object;
  private _metadata?: object;
  private _streamPosition?: number;

  private constructor(streamId: string) {
    this._streamId = streamId;
    this._created = new Date().toISOString();
  }

  static forStream(streamId: string) {
    return new StoredEventBuilder(streamId);
  }

  ofType(type: string): this {
    this._type = type;
    return this;
  }

  withPayload(payload: object) {
    this._payload = payload;
    return this;
  }

  atExpectedPosition(position: number) {
    this._streamPosition = position;
    return this;
  }

  withMetadata(metadata: object) {
    this._metadata = metadata;
    return this;
  }

  withNoMetadata() {
    return this.withMetadata({});
  }

  build(): StoredEvent {
    if (!this._type || !this._payload || !this._metadata || this._streamPosition === undefined) {
      throw new Error('Missing required fields for StoredEvent');
    }
    return {
      id: crypto.randomUUID(),
      type: this._type,
      payload: this._payload,
      streamId: this._streamId,
      created: this._created,
      metadata: this._metadata,
      streamPosition: this._streamPosition
    };
  }
}
