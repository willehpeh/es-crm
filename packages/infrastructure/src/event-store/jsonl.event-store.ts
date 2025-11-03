import { EventStore } from './event-store';
import { StoredEvent } from '@es-crm/domain';
import { FileHandle } from 'node:fs/promises';
import * as fs from 'fs/promises';

export class JsonlEventStore implements EventStore {

  private fileHandle?: FileHandle;

  async init(): Promise<void> {
    this.fileHandle = await fs.open('events.jsonl', 'a');
    return;
  }

  async append(eventOrEvents: StoredEvent | StoredEvent[]): Promise<void> {
    if (!this.fileHandle) {
      throw new Error('Event store not initialized');
    }
    if (eventOrEvents instanceof Array) {
      const eventsAsString = eventOrEvents.reduce((acc, event) => acc + JSON.stringify(event) + '\n', '');
      await this.fileHandle.write(eventsAsString);
    }
    await this.fileHandle.write(JSON.stringify(eventOrEvents + '\n'));
  }
}
