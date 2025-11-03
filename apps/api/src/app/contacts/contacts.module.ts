import { Module } from '@nestjs/common';
import { ContactsService } from './services/contacts.service';
import { ContactsController } from './controllers/contacts.controller';
import { RegisterNewContactHandler } from '@es-crm/application';
import { ContactRepository } from '@es-crm/domain';
import { EventStoreContactRepository } from '@es-crm/infrastructure';
import { EventStoreModule } from '../core/event-store/event-store.module';

@Module({
  imports: [
    EventStoreModule
  ],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    RegisterNewContactHandler,
    {
      provide: ContactRepository,
      useClass: EventStoreContactRepository,
    },
  ],
})
export class ContactsModule {}
