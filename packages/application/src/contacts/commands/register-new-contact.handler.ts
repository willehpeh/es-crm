import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterNewContact } from './register-new-contact';
import { Contact, ContactRepository } from '@es-crm/domain';

@CommandHandler(RegisterNewContact)
export class RegisterNewContactHandler
  implements ICommandHandler<RegisterNewContact>
{
  constructor(private readonly contacts: ContactRepository) {}

  async execute(command: RegisterNewContact): Promise<{ id: string }> {
    const contact = Contact.registerNew(command);
    return this.contacts.register(contact, command.id);
  }
}
