import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterNewContact } from './register-new-contact';
import { ContactId, ContactRepository } from '@es-crm/domain';

@CommandHandler(RegisterNewContact)
export class RegisterNewContactHandler implements ICommandHandler<RegisterNewContact> {

  constructor(private readonly contacts: ContactRepository) {
  }

  async execute(command: RegisterNewContact): Promise<ContactId> {
    return new ContactId();
  }
}
