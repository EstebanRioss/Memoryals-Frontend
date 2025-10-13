import { TestBed } from '@angular/core/testing';

import { Formulario } from './formulario';

describe('Formulario', () => {
  let service: Formulario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formulario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
