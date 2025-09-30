import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gas1y2 } from './gas1y2';

describe('Gas1y2', () => {
  let component: Gas1y2;
  let fixture: ComponentFixture<Gas1y2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gas1y2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gas1y2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
