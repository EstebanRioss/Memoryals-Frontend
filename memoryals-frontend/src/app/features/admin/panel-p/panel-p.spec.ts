import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelP } from './panel-p';

describe('PanelP', () => {
  let component: PanelP;
  let fixture: ComponentFixture<PanelP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelP);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
