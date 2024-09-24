import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfpieNeedleChartComponent } from './halfpie-needle-chart.component';

describe('HalfpieNeedleChartComponent', () => {
  let component: HalfpieNeedleChartComponent;
  let fixture: ComponentFixture<HalfpieNeedleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalfpieNeedleChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HalfpieNeedleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
