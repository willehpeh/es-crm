import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    Card,
    Button
  ],
  template: `
    <p-card class="text-center">
      <h1 class="logo text-2xl mb-12">ES CRM</h1>
      <p-button label="Contacts" severity="secondary" (onClick)="onNavigateToContacts()"/>
    </p-card>
  `
})
export class Sidebar {

  private router = inject(Router);

  protected onNavigateToContacts() {
    this.router.navigate(['/contacts']);
  }
}
