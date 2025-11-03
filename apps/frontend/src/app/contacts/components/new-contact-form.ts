import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { ContactsFacade } from '../facades/contacts.facade';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-contact-form',
  imports: [
    Card,
    FloatLabel,
    InputText,
    Select,
    Button,
    ReactiveFormsModule
  ],
  template: `
    <p-card header="New Contact" class="max-w-screen-sm mx-auto">
      <form [formGroup]="newContactForm">
        <p-floatlabel variant="in" class="w-2/3 mb-3">
          <input type="text" 
                 pInputText 
                 id="first-name" 
                 formControlName="firstName" 
                 class="w-full m-auto"
          />
          <label for="first-name">First Name</label>
        </p-floatlabel>
        <p-floatlabel variant="in" class="w-2/3 mb-3">
          <input type="text" 
                 pInputText 
                 id="last-name" 
                 formControlName="lastName" 
                 class="w-full m-auto"
          />
          <label for="last-name">Last Name</label>
        </p-floatlabel>
        <p-floatlabel variant="in" class="w-2/3 mb-3">
          <p-select formControlName="source" 
                    [editable]="true" 
                    id="source"
                    class="w-full m-auto"
          />
          <label for="source">Source</label>
        </p-floatlabel>
      </form>
      <ng-template #footer>
        <p-button label="Register" (onClick)="onRegisterContact()" />
      </ng-template>
    </p-card>
  `
})
export class NewContactForm {

  private contactsFacade = inject(ContactsFacade);
  private formBuilder = inject(FormBuilder);

  newContactForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    source: ['', Validators.required],
  });

  onRegisterContact(): void {
    if (this.formIsNotValid()) {
      this.showInvalidFields();
      return;
    }
    this.contactsFacade.registerNewContact(this.formValue());
  }

  private formValue() {
    return {
      firstName: this.newContactForm.get('firstName')?.value || '',
      lastName: this.newContactForm.get('lastName')?.value || '',
      source: this.newContactForm.get('source')?.value || ''
    };
  }

  private showInvalidFields() {
    this.newContactForm.markAllAsTouched();
    this.newContactForm.markAllAsDirty();
  }

  private formIsNotValid() {
    return !this.newContactForm.valid;
  }
}
