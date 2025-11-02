export abstract class ContactsFacade {
  abstract registerNewContact(props: { firstName: string, lastName: string, source: string }): void;
}
