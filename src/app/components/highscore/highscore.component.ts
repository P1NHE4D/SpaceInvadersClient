import { Component, OnInit } from '@angular/core';
import {HighScoreService} from "../../services/high-score.service";
import {SpHighScore} from "../../models/sp-high-score";
import {MpHighScore} from "../../models/mp-high-score";

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css']
})
export class HighscoreComponent implements OnInit {
  private spHighScores: SpHighScore[];
  private mpHighScores: MpHighScore[];

  constructor(private highScoreService: HighScoreService) { }

  ngOnInit() {
    this.getSpHighScores();
    this.getMpHighScores();
  }

  /**
   * Retrieves all single player high scores from server
   */
  getSpHighScores(): void {
    this.highScoreService.getSpHighScores<SpHighScore[]>().subscribe(
      scores => this.spHighScores = scores
    );
  }

  /**
   * Retrieves all multi player high scores from server
   */
  getMpHighScores(): void {
    this.highScoreService.getMpHighScores<MpHighScore[]>().subscribe(
      scores => this.mpHighScores = scores
    );
  }

}
