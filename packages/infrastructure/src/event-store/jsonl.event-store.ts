import { EventStore } from './event-store';
import * as fs from 'fs/promises';
import { StoredEvent } from './stored-event';

export class JsonlEventStore implements EventStore {

  async append(eventOrEvents: StoredEvent | StoredEvent[]): Promise<void> {
    await fs.appendFile('events.jsonl', this.stringify(eventOrEvents));
  }

  private stringify(eventOrEvents: StoredEvent | StoredEvent[]) {
    return eventOrEvents instanceof Array
      ? this.oneLinePerEvent(eventOrEvents)
      : JSON.stringify(eventOrEvents) + '\n';
  }

  private oneLinePerEvent(eventOrEvents: StoredEvent[]): string {
    return eventOrEvents.reduce((acc, event) => acc + JSON.stringify(event) + '\n', '');
  }
}
