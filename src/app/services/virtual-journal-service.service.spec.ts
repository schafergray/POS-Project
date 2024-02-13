import { TestBed } from '@angular/core/testing';

import { VirtualJournalServiceService } from './virtual-journal-service.service';

describe('VirtualJournalServiceService', () => {
  let service: VirtualJournalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualJournalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
