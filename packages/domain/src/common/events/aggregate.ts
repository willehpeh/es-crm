import { DomainEvent } from './domain-event';

export abstract class Aggregate {
  private _version = 0;
  private _uncommittedEvents: DomainEvent[] = [];

  abstract apply(event: DomainEvent): void;

  protected raise(event: DomainEvent): void {
    this.apply(event);
    this._uncommittedEvents.push(event);
  }

  uncommittedEvents(): DomainEvent[] {
    return this._uncommittedEvents;
  }

  baseVersion(): number {
    return this._version;
  }

  markAllAsCommitted(): void {
    this._version += this._uncommittedEvents.length;
    this._uncommittedEvents = [];
  }

  protected loadFromHistory(events: DomainEvent[]): void {
    this._version = 0;
    events.forEach((event) => {
      this.apply(event);
      this._version++;
    });
  }
}
