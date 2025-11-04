import { EventStoreContactRepository, InMemoryEventStore } from '@es-crm/infrastructure';
import { RegisterNewContact, RegisterNewContactDto, RegisterNewContactHandler } from '@es-crm/application';

describe('RegisterNewContact', () => {
  let command: RegisterNewContact;
  let handler: RegisterNewContactHandler;
  let dto: RegisterNewContactDto;
  let repository: EventStoreContactRepository;
  let eventStore: InMemoryEventStore;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    repository = new EventStoreContactRepository(eventStore);
    handler = new RegisterNewContactHandler(repository);
  });

  it('should register a new contact', async () => {
    dto = {
      firstName: 'John',
      lastName: 'Doe',
      source: 'LinkedIn'
    };
    command = new RegisterNewContact(dto);

    await handler.execute(command);

    expect(eventStore.events.length).toBe(1);
    const event = eventStore.events[0];
    expect(event.payload).toEqual({
      contactId: command.id.value(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      source: dto.source
    });
    expect(event.type).toBe('NewContactRegistered');
  });

  it('should return the new contact id', async () => {
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
