import { Module } from '@nestjs/common';
import { ContactsService } from './services/contacts.service';
import { ContactsController } from './controllers/contacts.controller';
import { RegisterNewContactHandler } from '@es-crm/application';
import { ContactRepository } from '@es-crm/domain';
import { InMemoryContactRepository } from '@es-crm/infrastructure';

@Module({
  controllers: [ContactsController],
  providers: [
    ContactsService,
    RegisterNewContactHandler,
    {
      provide: ContactRepository,
      useClass: InMemoryContactRepository,
    },
  ],
})
export class ContactsModule {}
