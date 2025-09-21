import { TestBed } from '@angular/core/testing';

import { ChatWidget } from '../../../shared/chat-widget/chat-widget';

describe('ChatWidget', () => {
  let service: ChatWidget;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatWidget);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
