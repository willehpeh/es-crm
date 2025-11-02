import { NgrxContactsFacade } from './ngrx-contacts.facade';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ContactsApi } from '../services/contacts.api';

describe('NgrxContactsFacade', () => {
  let facade: NgrxContactsFacade;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgrxContactsFacade,
        ContactsApi,
        provideHttpClient(),
        provideHttpClientTesting()
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
