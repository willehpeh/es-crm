import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterNewContact } from './register-new-contact';
import { Contact, ContactRepository } from '@es-crm/domain';

@CommandHandler(RegisterNewContact)
export class RegisterNewContactHandler
  implements ICommandHandler<RegisterNewContact>
{
  constructor(private readonly contacts: ContactRepository) {}

  async execute(command: RegisterNewContact): Promise<{ id: string }> {
    const contact = new Contact(command);
    const contactId = await this.contacts.register(contact);
    return { id: contactId.value() };
  }
}
