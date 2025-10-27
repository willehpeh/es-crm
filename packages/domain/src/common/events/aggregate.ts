import { DomainEvent } from './domain-event';

export abstract class Aggregate {
  private _uncommittedEvents: DomainEvent[] = [];

  abstract apply(event: DomainEvent): void;

  applyAll(events: DomainEvent[]): void {
    events.forEach((event) => this.apply(event));
  }

  uncommittedEvents(): DomainEvent[] {
    return this._uncommittedEvents;
  }

  markAllAsCommitted(): void {
    this._uncommittedEvents = [];
  }

  protected publish(event: DomainEvent): void {
    this._uncommittedEvents.push(event);
  }
}
