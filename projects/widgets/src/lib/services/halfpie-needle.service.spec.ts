import { TestBed } from '@angular/core/testing';

import { HalfpieNeedleService } from './halfpie-needle.service';

describe('HalfpieNeedleService', () => {
  let service: HalfpieNeedleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HalfpieNeedleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
