import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Micuota } from './micuota';

describe('Micuota', () => {
  let component: Micuota;
  let fixture: ComponentFixture<Micuota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Micuota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Micuota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
