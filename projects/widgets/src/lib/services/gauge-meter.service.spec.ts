import { TestBed } from '@angular/core/testing';

import { GaugeMeterService } from './gauge-meter.service';

describe('GaugeMeterService', () => {
  let service: GaugeMeterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GaugeMeterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
