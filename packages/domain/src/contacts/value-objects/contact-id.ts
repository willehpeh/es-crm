import { EntityId } from '../../common';

export class ContactId extends EntityId {
  static new(): ContactId {
    return new ContactId();
  }
}
