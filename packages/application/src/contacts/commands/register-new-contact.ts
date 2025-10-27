import { Command } from '@nestjs/cqrs';
import { ContactId } from '@es-crm/domain';
import { RegisterNewContactDto } from './register-new-contact.dto';

export class RegisterNewContact extends Command<ContactId> {
  constructor(dto: RegisterNewContactDto) {
    super();
  }
}
