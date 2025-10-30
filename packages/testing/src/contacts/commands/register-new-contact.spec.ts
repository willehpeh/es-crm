import { InMemoryContactRepository } from '../fixtures/in-memory-contact.repository';
import {
  RegisterNewContact,
  RegisterNewContactDto,
  RegisterNewContactHandler,
} from '@es-crm/application';
import { ContactId } from '@es-crm/domain';

describe('RegisterNewContact', () => {
  let command: RegisterNewContact;
  let handler: RegisterNewContactHandler;
  let dto: RegisterNewContactDto;
  let repository: InMemoryContactRepository;

  it('smoke test', async () => {
    repository = new InMemoryContactRepository();
    handler = new RegisterNewContactHandler(repository);
    dto = {
      firstName: 'John',
      lastName: 'Doe',
      source: 'website',
    };
    command = new RegisterNewContact(dto);

    expect(await handler.execute(command)).toBeInstanceOf(ContactId);
  });
});
