import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticleStackedbarComponent } from './verticle-stackedbar.component';

describe('VerticleStackedbarComponent', () => {
  let component: VerticleStackedbarComponent;
  let fixture: ComponentFixture<VerticleStackedbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticleStackedbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerticleStackedbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
