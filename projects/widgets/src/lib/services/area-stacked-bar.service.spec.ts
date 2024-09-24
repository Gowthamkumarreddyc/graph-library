import { TestBed } from '@angular/core/testing';

import { AreaStackedBarService } from './area-stacked-bar.service';

describe('AreaStackedBarService', () => {
  let service: AreaStackedBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaStackedBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
