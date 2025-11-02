import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { ContactsFacade } from '../facades/contacts.facade';

@Component({
  selector: 'app-new-contact-form',
  imports: [Card, FloatLabel, InputText, Select, Button],
  template: `
    <p-card header="New Contact">
      <p-floatlabel variant="in">
        <input type="text" pInputText id="first-name" />
        <label for="first-name">First Name</label>
      </p-floatlabel>
      <p-floatlabel variant="in">
        <input type="text" pInputText id="last-name" />
        <label for="last-name">Last Name</label>
      </p-floatlabel>
      <p-floatlabel variant="in">
        <p-select />
      </p-floatlabel>
      <ng-template #footer>
        <p-button label="Register" (onClick)="onRegisterContact()"/>
      </ng-template>
    </p-card>
  `,
})
export class NewContactForm {

  private contactsFacade = inject(ContactsFacade);

  onRegisterContact(): void {
    this.contactsFacade.registerNewContact({
      firstName: 'Will',
      lastName: 'Alexander',
      source: 'LinkedIn',
    });
  }
}
