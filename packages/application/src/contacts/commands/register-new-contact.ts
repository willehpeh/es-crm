import { Command } from '@nestjs/cqrs';
import { ContactId } from '@es-crm/domain';
import { RegisterNewContactDto } from './register-new-contact.dto';

export class RegisterNewContact extends Command<ContactId> {

  firstName: FirstName;
  lastName: LastName;
  id: ContactId;
  source: ContactSource;

  constructor(dto: RegisterNewContactDto) {
    super();
    this.firstName = new FirstName(dto.firstName);
    this.lastName = new LastName(dto.lastName);
    this.id = ContactId.new();
    this.source = new ContactSource(dto.source);
  }
}
