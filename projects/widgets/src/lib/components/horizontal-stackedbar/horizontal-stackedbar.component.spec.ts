import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalStackedbarComponent } from './horizontal-stackedbar.component';

describe('HorizontalStackedbarComponent', () => {
  let component: HorizontalStackedbarComponent;
  let fixture: ComponentFixture<HorizontalStackedbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalStackedbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorizontalStackedbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
