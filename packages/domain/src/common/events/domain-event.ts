export type DomainEvent<T> = {
  id: string;
  streamId: string;
  payload: T;
  type: string;
  version: number;
  created: string;
  metadata: object;
};
