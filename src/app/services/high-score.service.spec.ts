import { TestBed } from '@angular/core/testing';

import { HighScoreService } from './high-score.service';

describe('HighScoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HighScoreService = TestBed.get(HighScoreService);
    expect(service).toBeTruthy();
  });
});
