import { TestBed } from '@angular/core/testing';

import { DpaService } from './dpa.service';

describe('DpaService', () => {
  let service: DpaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DpaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
