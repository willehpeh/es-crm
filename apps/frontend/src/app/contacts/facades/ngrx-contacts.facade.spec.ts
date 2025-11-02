import { NgrxContactsFacade } from './ngrx-contacts.facade';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ContactsApi } from '../services/contacts.api';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ContactsEffects } from '../state/contacts.effects';
import * as fromContacts from '../state/contacts.reducer';

describe('NgrxContactsFacade', () => {
  let facade: NgrxContactsFacade;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects([
          ContactsEffects,
        ]),
        provideState(fromContacts.featureKey, fromContacts.reducer),
        NgrxContactsFacade,
        ContactsApi,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    facade = TestBed.inject(NgrxContactsFacade);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('SMOKE TEST', () => {
    expect(facade).toBeDefined();
  });

  it('should register the new contact', () => {
    facade.registerNewContact({ firstName: 'John', lastName: 'Doe', source: 'test' });
    const req = httpCtrl.expectOne('/api/contacts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ firstName: 'John', lastName: 'Doe', source: 'test' });
  });

  afterEach(() => {
    httpCtrl.verify();
  })
});
