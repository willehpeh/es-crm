export type DomainEvent = {
  type: string;
  payload: object;
};

export type StoredEvent = DomainEvent & {
  id: string;
  streamId: string;
  created: string;
  metadata: object;
  streamPosition: number;
  version?: number;
  tenantId?: string;
  userId?: string;
  correlationId?: string;
  causationId?: string;
}
