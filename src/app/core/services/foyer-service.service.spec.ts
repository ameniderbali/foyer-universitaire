import { TestBed } from '@angular/core/testing';

import { FoyerServiceService } from './foyer-service.service';

describe('FoyerServiceService', () => {
  let service: FoyerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoyerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
