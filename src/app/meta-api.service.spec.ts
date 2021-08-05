import { TestBed } from '@angular/core/testing';

import { MetaApiService } from './meta-api.service';

describe('MetaApiService', () => {
  let service: MetaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
