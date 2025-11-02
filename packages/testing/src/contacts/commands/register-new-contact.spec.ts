import { InMemoryContactRepository } from '../fixtures/in-memory-contact.repository';
import {
  RegisterNewContact,
  RegisterNewContactDto,
  RegisterNewContactHandler,
} from '@es-crm/application';
import {
  ContactId,
  NewContactRegistered,
  FirstName,
  LastName,
  ContactSource,
} from '@es-crm/domain';

describe('RegisterNewContact', () => {
  let command: RegisterNewContact;
  let handler: RegisterNewContactHandler;
  let dto: RegisterNewContactDto;
  let repository: InMemoryContactRepository;

  it('should register a new contact', async () => {
    repository = new InMemoryContactRepository();
    handler = new RegisterNewContactHandler(repository);
    dto = {
      firstName: 'John',
      lastName: 'Doe',
      source: 'LinkedIn'
    };
    command = new RegisterNewContact(dto);

    await handler.execute(command);

    expect(repository.events.length).toBe(1);
    const event = repository.events[0] as NewContactRegistered;
    expect(event).toEqual({
      type: 'NewContactRegistered',
      payload: {
        contactId: expect.any(ContactId),
        firstName: new FirstName(dto.firstName),
        lastName: new LastName(dto.lastName),
        source: new ContactSource(dto.source),
      }
    });
  })

  it('should return the new contact id', async () => {
    repository = new InMemoryContactRepository();
    handler = new RegisterNewContactHandler(repository);
    dto = {
      firstName: 'John',
      lastName: 'Doe',
      source: 'LinkedIn'
    };
    command = new RegisterNewContact(dto);

    const id = await handler.execute(command);

    expect(id).toEqual({ id: command.id.value() });
  });
});
