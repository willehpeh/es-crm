import { DomainEvent } from './domain-event';

export interface Aggregate {
  apply(events: DomainEvent[]): void;
  apply(event: DomainEvent): void;
  uncommittedEvents(): DomainEvent[];
  markAllAsCommitted(): void;
}
