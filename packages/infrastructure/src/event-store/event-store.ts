import { StoredEvent } from '@es-crm/domain';

export abstract class EventStore {
  abstract append(eventOrEvents: StoredEvent | StoredEvent[]): Promise<void>;
}
