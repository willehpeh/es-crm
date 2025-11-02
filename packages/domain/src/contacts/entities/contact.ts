import { Aggregate, ValueObject } from '../../common';
import { ContactId } from '../value-objects';
import { NewContactRegistered } from '../events';

export class FirstName implements ValueObject<string> {
  constructor(private readonly _firstName: string) {}

  equals(other: FirstName): boolean {
    return this._firstName === other._firstName;
  }

  value(): string {
    return this._firstName;
  }
}

export class ContactSource implements ValueObject<string> {
  constructor(private readonly _source: string) {}

  equals(other: ContactSource): boolean {
    return this._source === other._source;
  }

  value(): string {
    return this._source;
  }
}

export class LastName implements ValueObject<string> {
  constructor(private readonly _lastName: string) {}

  equals(other: LastName): boolean {
    return this._lastName === other._lastName;
  }

  value(): string {
    return this._lastName;
  }
}

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
        contactId: props.id,
        firstName: props.firstName,
        lastName: props.lastName,
        source: props.source,
      },
      type: 'NewContactRegistered',
    };
    this.raise(newContactRegistered);
  }

  apply(): void {
    // noop
  }
}
