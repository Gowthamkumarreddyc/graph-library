import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDensityChartComponent } from './area-density-chart.component';

describe('AreaDensityChartComponent', () => {
  let component: AreaDensityChartComponent;
  let fixture: ComponentFixture<AreaDensityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaDensityChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaDensityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
