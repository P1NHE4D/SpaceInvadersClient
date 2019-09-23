import { TestBed } from '@angular/core/testing';

import { GameLogicService } from './game-logic.service';

// TODO: Unit test

describe('GameLogicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameLogicService = TestBed.get(GameLogicService);
    expect(service).toBeTruthy();
  });
});
