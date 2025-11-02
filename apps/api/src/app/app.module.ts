import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ContactsModule,
    CqrsModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
