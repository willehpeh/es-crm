export type DomainEvent = {
  id: string;
  streamId: string;
  payload: object;
  type: string;
  version: number;
  created: string;
  metadata: object;
};
