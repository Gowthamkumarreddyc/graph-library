import { TestBed } from '@angular/core/testing';

import { ViolinService } from './violin.service';

describe('ViolinService', () => {
  let service: ViolinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
