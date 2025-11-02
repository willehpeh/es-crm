import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterNewContact } from './register-new-contact';
import { Contact, ContactId, ContactRepository } from '@es-crm/domain';

@CommandHandler(RegisterNewContact)
export class RegisterNewContactHandler
  implements ICommandHandler<RegisterNewContact>
{
  constructor(private readonly contacts: ContactRepository) {}

  async execute(command: RegisterNewContact): Promise<ContactId> {
    const contact = new Contact(command);
    return this.contacts.register(contact);
  }
}
