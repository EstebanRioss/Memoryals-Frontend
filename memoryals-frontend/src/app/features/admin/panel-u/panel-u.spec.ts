import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelU } from './panel-u';

describe('PanelU', () => {
  let component: PanelU;
  let fixture: ComponentFixture<PanelU>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelU]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelU);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
