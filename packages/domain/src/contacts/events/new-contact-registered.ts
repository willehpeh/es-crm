import {
  ContactId,
  ContactSource,
  FirstName,
  LastName,
} from '../value-objects';

export type NewContactRegistered = {
  payload: {
    contactId: ContactId,
    firstName: FirstName,
    lastName: LastName,
    source: ContactSource,
  };
  type: 'NewContactRegistered';
}
