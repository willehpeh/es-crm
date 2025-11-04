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

  private readonly _id: ContactId;
  private _firstName: FirstName;
  private _lastName: LastName;
  private _source: ContactSource;

  constructor(props: NewContactProps) {
    super();
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._source = props.source;
  }

  static registerNew(props: NewContactProps): Contact {
    const contact = new Contact(props);
    const newContactRegistered: NewContactRegistered = {
      payload: {
        contactId: props.id.value(),
        firstName: props.firstName.value(),
        lastName: props.lastName.value(),
        source: props.source.value(),
      },
      type: 'NewContactRegistered',
    };
    contact.raise(newContactRegistered);
    return contact;
  }

  id(): ContactId {
    return this._id;
  }

  apply(): void {
    // noop
  }
}
