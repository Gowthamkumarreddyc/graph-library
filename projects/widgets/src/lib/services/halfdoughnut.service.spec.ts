import { TestBed } from '@angular/core/testing';

import { HalfdoughnutService } from './halfdoughnut.service';

describe('HalfdoughnutService', () => {
  let service: HalfdoughnutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HalfdoughnutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
