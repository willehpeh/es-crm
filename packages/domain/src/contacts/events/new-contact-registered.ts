import { ContactId } from '../value-objects';
import { ContactSource, FirstName, LastName } from '../entities';

export type NewContactRegistered = {
  payload: {
    contactId: ContactId,
    firstName: FirstName,
    lastName: LastName,
    source: ContactSource,
  };
  type: 'NewContactRegistered';
}
