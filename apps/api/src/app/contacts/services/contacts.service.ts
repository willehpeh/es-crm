import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterNewContact, RegisterNewContactDto } from '@es-crm/application';

@Injectable()
export class ContactsService {
  constructor(private readonly commandBus: CommandBus) {}

  async registerNewContact(dto: RegisterNewContactDto): Promise<{ id: string }> {
    return this.commandBus.execute(new RegisterNewContact(dto));
  }
}
