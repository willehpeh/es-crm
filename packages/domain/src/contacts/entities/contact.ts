import { Aggregate, DomainEvent } from '../../common';
import { ContactId } from '../value-objects';

export class Contact extends Aggregate {
  constructor(private readonly _id: ContactId) {
    super();
  }

  apply(event: DomainEvent): void {
    // Unimplemented
  }
}
