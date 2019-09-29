import { TestBed } from '@angular/core/testing';

import { HighScoreService } from './high-score.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {SpHighScore} from "../models/sp-high-score";
import {MpHighScore} from "../models/mp-high-score";

describe('HighScoreService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let highScoreService: HighScoreService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighScoreService],
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    highScoreService = TestBed.get(HighScoreService);
  });


  it('gets all sp high scores', async() => {
    const testData: SpHighScore[] = [
      {id: 'ab9471ca-23ef-4f7d-900a-5e94230ef5cc', playerOneName: 'Peter', score: 450},
      {id: 'aee72eb6-6d5a-48d1-93a4-22056e228595', playerOneName: 'Dummy', score: 1580},
      {id: '360856db-b5a0-483f-8255-2f3ea0b7a94f', playerOneName: 'Odin', score: 4000}
    ];

    await highScoreService.getSpHighScores<SpHighScore[]>().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('http://localhost:5000/api/sp-high-score');

    expect(req.request.method).toEqual('GET');

    req.flush(testData);

    httpTestingController.verify();
  });


  it('gets all mp high scores', async() => {
    const testData: MpHighScore[] = [
      {id: 'ab9471ca-23ef-4f7d-900a-5e94230ef5cc', playerOneName: 'Peter', playerTwoName: 'Johnny', score: 450},
      {id: 'aee72eb6-6d5a-48d1-93a4-22056e228595', playerOneName: 'Dummy', playerTwoName: 'Aden', score: 1580},
      {id: '360856db-b5a0-483f-8255-2f3ea0b7a94f', playerOneName: 'Odin', playerTwoName: 'Vegard', score: 4000}
    ];

    await highScoreService.getMpHighScores<MpHighScore[]>().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('http://localhost:5000/api/mp-high-score');

    expect(req.request.method).toEqual('GET');

    req.flush(testData);

    httpTestingController.verify();
  });


  it('adds a sp high score entry', async() => {
    const testData: SpHighScore = {
      id: 'ab9471ca-23ef-4f7d-900a-5e94230ef5cc',
      playerOneName: 'TestDummy',
      score: 450
    };

    await highScoreService.addSpHighScore<SpHighScore>(testData).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('http://localhost:5000/api/sp-high-score');

    expect(req.request.method).toEqual('POST');

    req.flush(testData);

    httpTestingController.verify();
  });


  it('adds a mp high score entry', async() => {
    const testData: MpHighScore = {
      id: 'ab9471ca-23ef-4f7d-900a-5e94230ef5cc',
      playerOneName: 'TestDummy',
      playerTwoName: 'James',
      score: 450
    };

    await highScoreService.addMpHighScore<MpHighScore>(testData).subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('http://localhost:5000/api/mp-high-score');

    expect(req.request.method).toEqual('POST');

    req.flush(testData);

    httpTestingController.verify();
  });


  afterEach(() => {
    httpTestingController.verify();
  });

});
