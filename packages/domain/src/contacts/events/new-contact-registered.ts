export type NewContactRegistered = {
  payload: {
    contactId: string,
    firstName: string,
    lastName: string,
    source: string,
  };
  type: 'NewContactRegistered';
}
