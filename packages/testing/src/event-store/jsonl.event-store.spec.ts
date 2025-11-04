import { JsonlEventStore, StoredEventBuilder } from '@es-crm/infrastructure';
import { beforeEach } from 'vitest';
import * as fs from 'node:fs';

describe('JSONL Event Store', () => {
  const TEST_FILE_PATH = 'test-events.jsonl';
  let eventStore: JsonlEventStore;

  beforeEach(() => {
    eventStore = new JsonlEventStore(TEST_FILE_PATH);
  });

  it('should write 5 events', async () => {
    const events = Array(5)
      .fill(0)
      .map((_, i) => StoredEventBuilder
        .forStream('test-stream')
        .ofType('TestEvent')
        .withPayload({ id: i })
        .atExpectedPosition(i)
        .withNoMetadata()
        .build()
      );
    await eventStore.append(events);

    const file = fs.readFileSync(TEST_FILE_PATH, 'utf-8');
    const readEvents = file.trim().split('\n').map(line => JSON.parse(line));
    expect(readEvents).toEqual(events);
  });

  afterEach(() => {
    fs.unlinkSync('test-events.jsonl');
  });
});
