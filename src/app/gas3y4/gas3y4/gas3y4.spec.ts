import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gas3y4 } from './gas3y4';

describe('Gas3y4', () => {
  let component: Gas3y4;
  let fixture: ComponentFixture<Gas3y4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gas3y4]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gas3y4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
