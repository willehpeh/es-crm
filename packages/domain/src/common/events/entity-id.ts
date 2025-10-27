import { ValueObject } from './value-object';

export abstract class EntityId implements ValueObject<string> {

  private readonly _id = crypto.randomUUID();

  equals(other: EntityId): boolean {
    return this.value() === other.value();
  }

  value(): string {
    return this._id;
  }

}
