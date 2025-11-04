import { EventStore } from './event-store';
import { StoredEvent } from '@es-crm/domain';

export class InMemoryEventStore implements EventStore {

  events: StoredEvent[] = [];

  async append(eventOrEvents: StoredEvent | StoredEvent[]): Promise<void> {
    if (eventOrEvents instanceof Array) {
      this.events.push(...eventOrEvents);
      return;
    }
    this.events.push(eventOrEvents);
  }
}
