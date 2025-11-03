import { Module } from '@nestjs/common';
import { EventStore, JsonlEventStore } from '@es-crm/infrastructure';

@Module({
  providers: [
    {
      provide: EventStore,
      useFactory: async () => {
        const store = new JsonlEventStore();
        await store.init();
        return store;
      }
    },
  ],
  exports: [
    EventStore
  ]
})
export class EventStoreModule {}
