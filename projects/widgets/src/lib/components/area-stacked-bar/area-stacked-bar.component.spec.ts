import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaStackedBarComponent } from './area-stacked-bar.component';

describe('AreaStackedBarComponent', () => {
  let component: AreaStackedBarComponent;
  let fixture: ComponentFixture<AreaStackedBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaStackedBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaStackedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
