import { NgrxContactsFacade } from './ngrx-contacts.facade';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { ContactsApi } from '../services/contacts.api';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ContactsEffects } from '../state/contacts.effects';
import * as fromContacts from '../state/contacts.reducer';
import { provideFacadeTest } from '../../core/providers/facade-test.providers';

describe('NgrxContactsFacade', () => {
  let facade: NgrxContactsFacade;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFacadeTest(),
        provideEffects([
          ContactsEffects,
        ]),
        provideState(fromContacts.featureKey, fromContacts.reducer),
        NgrxContactsFacade,
        ContactsApi,
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
