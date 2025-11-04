import { StoredEvent } from './stored-event';

export abstract class EventStore {
  abstract append(eventOrEvents: StoredEvent | StoredEvent[]): Promise<void>;
}
