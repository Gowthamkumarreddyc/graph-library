import { TestBed } from '@angular/core/testing';

import { DoughnutService } from './doughnut.service';

describe('DoughnutService', () => {
  let service: DoughnutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoughnutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
