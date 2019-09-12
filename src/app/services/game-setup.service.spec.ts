import { TestBed } from '@angular/core/testing';

import { GameSetupService } from './game-setup.service';

describe('GameSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameSetupService = TestBed.get(GameSetupService);
    expect(service).toBeTruthy();
  });
});
