import { EventStore } from './event-store';

import { StoredEvent } from './stored-event';

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
