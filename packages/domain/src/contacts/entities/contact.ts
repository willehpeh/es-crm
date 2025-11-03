import { Aggregate } from '../../common';
import {
  ContactId,
  ContactSource,
  FirstName,
  LastName,
} from '../value-objects';
import { NewContactRegistered } from '../events';

type NewContactProps = {
  firstName: FirstName;
  lastName: LastName;
  id: ContactId;
  source: ContactSource;
};

export class Contact extends Aggregate {
  constructor(props: NewContactProps) {
    super();
    const newContactRegistered: NewContactRegistered = {
      payload: {
        contactId: props.id.value(),
        firstName: props.firstName.value(),
        lastName: props.lastName.value(),
        source: props.source.value(),
      },
      type: 'NewContactRegistered',
    };
    this.raise(newContactRegistered);
  }

  apply(): void {
    // noop
  }
}
