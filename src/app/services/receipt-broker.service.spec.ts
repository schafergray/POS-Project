import { TestBed } from '@angular/core/testing';

import { ReceiptBrokerService } from './receipt-broker.service';

describe('ReceiptService', () => {
  let service: ReceiptBrokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptBrokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
