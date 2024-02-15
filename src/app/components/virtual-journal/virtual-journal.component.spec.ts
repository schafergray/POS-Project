import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualJournalComponent } from './virtual-journal.component';

describe('VirtualJournalComponent', () => {
  let component: VirtualJournalComponent;
  let fixture: ComponentFixture<VirtualJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualJournalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirtualJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
