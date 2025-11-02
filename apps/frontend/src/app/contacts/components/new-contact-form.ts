import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-new-contact-form',
  imports: [Card, FloatLabel, InputText, Select],
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
    </p-card>
  `,
})
export class NewContactForm {}
