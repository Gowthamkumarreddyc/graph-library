import { TestBed } from '@angular/core/testing';

import { VerticleStackedbarService } from './verticle-stackedbar.service';

describe('VerticleStackedbarService', () => {
  let service: VerticleStackedbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerticleStackedbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
