import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfdoughnutComponent } from './halfdoughnut.component';

describe('HalfdoughnutComponent', () => {
  let component: HalfdoughnutComponent;
  let fixture: ComponentFixture<HalfdoughnutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalfdoughnutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HalfdoughnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
