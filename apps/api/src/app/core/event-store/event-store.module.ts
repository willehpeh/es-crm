import { Module } from '@nestjs/common';
import { EventStore, JsonlEventStore } from '@es-crm/infrastructure';

@Module({
  providers: [
    {
      provide: EventStore,
      useClass: JsonlEventStore,
    },
  ],
  exports: [
    EventStore
  ]
})
export class EventStoreModule {}
