import { Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';

@Component({
  selector: 'app-sidebar',
  imports: [
    Toolbar
  ],
  template: `
    <p-toolbar [style]="{ padding: '1rem 1.5rem' }">
      <ng-template #start>
        <h1 class="logo text-2xl">ES CRM</h1>
      </ng-template>
    </p-toolbar>
  `
})
export class Sidebar {}
