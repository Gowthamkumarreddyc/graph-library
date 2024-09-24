import { TestBed } from '@angular/core/testing';

import { HorizontalstakedbarService } from './horizontalstakedbar.service';

describe('HorizontalstakedbarService', () => {
  let service: HorizontalstakedbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorizontalstakedbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
