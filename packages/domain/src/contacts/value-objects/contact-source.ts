import { ValueObject } from '../../common';

export class ContactSource implements ValueObject<string> {
  constructor(private readonly _source: string) {}

  equals(other: ContactSource): boolean {
    return this._source === other._source;
  }

  value(): string {
    return this._source;
  }
}
