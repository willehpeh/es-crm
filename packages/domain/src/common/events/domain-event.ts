export type DomainEvent = {
  type: string;
  payload: object;
};

export type StoredEvent = DomainEvent & {
  id: string;
  streamId: string;
  version: number;
  created: string;
  metadata: object;
  tenantId?: string;
  userId?: string;
  correlationId?: string;
  causationId?: string;
}
