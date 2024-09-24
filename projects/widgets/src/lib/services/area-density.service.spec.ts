import { TestBed } from '@angular/core/testing';

import { AreaDensityService } from './area-density.service';

describe('AreaDensityService', () => {
  let service: AreaDensityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaDensityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
