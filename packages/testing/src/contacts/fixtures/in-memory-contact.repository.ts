import {
  Contact,
  ContactId,
  ContactRepository,
  DomainEvent,
} from '@es-crm/domain';

export class InMemoryContactRepository implements ContactRepository {
  events: DomainEvent[] = [];

  register(contact: Contact): ContactId {
    return new ContactId();
  }
}
