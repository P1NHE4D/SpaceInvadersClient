import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {GameLogicService} from "../../services/game-logic.service";
import {Explosion} from "../../game-objects/Explosion";
import {Location} from "@angular/common";
import {HighScoreService} from "../../services/high-score.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MpHighScore} from "../../models/mp-high-score";
import {SpHighScore} from "../../models/sp-high-score";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameLogicService]
})
export class GameComponent implements OnInit {
  @Input() multiplayer: boolean = false;
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef;
  private displayPreGameModal: string = 'block';
  private displayGameOverModal: string = 'none';

  private ctx: CanvasRenderingContext2D;
  private availableBattleships: HTMLImageElement[] = [];
  private playerOneSelectedBattleship: HTMLImageElement;
  private playerTwoSelectedBattleship: HTMLImageElement;
  private shipsSelected: boolean = false;

  private numbOfEnemyRows: number = 4;
  private ticksBetweenMoves: number = 20;
  private movementTicksCount: number = 0;
  private ticksBetweenShots: number = 90;
  private shotTicksCount: number = 0;
  private gameLoaded: boolean = false;
  private gameSetup: boolean = false;
  private level: number = 1;

  private spHighScoreForm: FormGroup = new FormGroup({
    playerOneName: new FormControl()
  });
  private mpHighScoreForm: FormGroup = new FormGroup({
    playerOneName: new FormControl(),
    playerTwoName: new FormControl()
  });


  constructor(
    private location: Location,
    private loader: LoaderService,
    private gameLogic: GameLogicService,
    private highScoreService: HighScoreService,
    private router: Router
  ) {}

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.loader.resourcesLoaded$.subscribe( () => {
      this.availableBattleships.push(
        this.loader.getImage('RedFighter'),
        this.loader.getImage('BlueFighter'),
        this.loader.getImage('A318')
      );
      this.playerOneSelectedBattleship = this.loader.getImage('RedFighter');
      this.playerTwoSelectedBattleship = this.loader.getImage('RedFighter');
      this.gameLoaded = true;
    });
    this.loadGameResources();
  }

  // TODO: Improve key handling to improve overall gameplay experience and smoothness
  // TODO: when both player hold down their movement keys, no player moves
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    if (this.gameLoaded && this.gameSetup) {
      switch (event.key) {
        case("ArrowUp"):
          this.gameLogic.fireBullet("playerOne", this.loader.getImage("PlayerOneBullet"), this.ctx);
          break;
        case("ArrowLeft"):
          this.gameLogic.movePlayerLeft("playerOne");
          break;
        case("ArrowRight"):
          this.gameLogic.movePlayerRight("playerOne");
          break;
      }
      if (this.multiplayer) {
        switch(event.key) {
          case("w"):
            this.gameLogic.fireBullet("playerTwo", this.loader.getImage("PlayerTwoBullet"), this.ctx);
            break;
          case("a"):
            this.gameLogic.movePlayerLeft("playerTwo");
            break;
          case("d"):
            this.gameLogic.movePlayerRight("playerTwo");
            break;
        }
      }
    }
  }

  // Loads all assets used in the game
  private loadGameResources(): void {
    this.loader.preload([
      {name: 'RedFighter', type: 'image', src: '/assets/gameObjects/RedFighter.png'},
      {name: 'BlueFighter', type: 'image', src: '/assets/gameObjects/BlueFighter.png'},
      {name: 'A318', type: 'image', src: '/assets/gameObjects/A318.png'},
      {name: 'PlayerOneBullet', type: 'image', src: '/assets/gameObjects/PlayerOneBullet.png'},
      {name: 'PlayerTwoBullet', type: 'image', src: '/assets/gameObjects/PlayerTwoBullet.png'},
      {name: 'EnemyBullet', type: 'image', src: '/assets/gameObjects/EnemyBullet.png'},
      {name: 'Android', type: 'image', src: '/assets/gameObjects/AndroidAlien.png'},
      {name: 'Squid', type: 'image', src: '/assets/gameObjects/SquidAlien.png'},
      {name: 'Death', type: 'image', src: '/assets/gameObjects/DeathAlien.png'},
      {name: 'Explosion', type: 'image', src: '/assets/gameObjects/Explosion.png'},
      {name: 'BigExplosion', type: 'image', src: '/assets/gameObjects/BigExplosion.png'},
    ]);
  }

  // Spawns player(s) and enemies
  private setupGame(): void {

    let playerImage = this.playerOneSelectedBattleship;
    let x: number = (this.ctx.canvas.width / 2) - playerImage.width / 2;
    let y: number = this.ctx.canvas.height;
    this.gameLogic.spawnPlayer("playerOne", playerImage, this.ctx, x, y);

    if (this.multiplayer) {
      playerImage = this.playerTwoSelectedBattleship;
      x = (this.ctx.canvas.width / 2) + playerImage.width;
      this.gameLogic.spawnPlayer("playerTwo", playerImage, this.ctx, x, y);
    }

    this.spawnEnemies();
    this.gameSetup = true;
  }

  private gameLoop = () => {
    //TODO: spawn special enemies, e.g. ISS, UFO, nyan-nyan cat
    //TODO: add background music
    if (this.gameLogic.gameIsOver()) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.displayGameOverModal = 'block';
      return;
    }
    this.gameLogic.checkForPlayerBulletIntersections(this.loader.getImage("Explosion"), this.ctx, 32, 1);
    this.gameLogic.checkForEnemyBulletIntersections(this.loader.getImage("BigExplosion"), this.ctx, 32, 1);
    if (this.gameLogic.enemiesRemaining() === 0) {
      ++this.level;
      this.increaseDifficulty();
      this.spawnEnemies();
    }
    this.gameLogic.movePlayerBullets();
    this.gameLogic.moveEnemyBullets();
    if ((++this.movementTicksCount) === this.ticksBetweenMoves) {
      this.movementTicksCount = 0;
      this.gameLogic.moveEnemies();
    }
    if ((++this.shotTicksCount) === this.ticksBetweenShots) {
      this.shotTicksCount = 0;
      this.gameLogic.fireEnemyBullet(this.loader.getImage("EnemyBullet"), this.ctx);
    }
    requestAnimationFrame(this.gameLoop);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.gameLogic.renderGameObjects();
  };

  // Spawns rows of enemies
  private spawnEnemies(): void {
    for (let j = 0; j < this.numbOfEnemyRows; ++j) {
      let img: HTMLImageElement;
      let hitScore: number;
      switch(j % 3) {
        case 0:
          img = this.loader.getImage('Android');
          hitScore = 10;
          break;
        case 1:
          img = this.loader.getImage('Squid');
          hitScore = 20;
          break;
        case 2:
          img = this.loader.getImage('Death');
          hitScore = 30;
          break;
      }
      this.gameLogic.spawnEnemyRow(img, this.ctx, hitScore, 2, 30);
    }
  }

  // Increases the difficulty of the game according to the current level
  private increaseDifficulty(): void {
    if (this.numbOfEnemyRows <= 7 && this.level % 2 === 0) {
      ++this.numbOfEnemyRows;
    }
    if (this.ticksBetweenShots >= 60 && this.level % 3 === 0) {
      this.ticksBetweenShots -= 10;
    }
    if (this.ticksBetweenMoves >= 10 && this.level % 5 === 0) {
      this.ticksBetweenMoves -= 5;
    }
  }

  // hides the pre-game modal window
  private hidePreGameModal(): void {
    this.displayPreGameModal = 'none';
  }

  // sets the battleship image selected by player one
  private selectPlayerOneShip(image: HTMLImageElement): void {
    this.playerOneSelectedBattleship = image;
  }

  // sets the battleship image selected by player two
  private selectPlayerTwoShip(image: HTMLImageElement): void {
    this.playerTwoSelectedBattleship = image;
  }

  // confirms the ship selection
  private confirmSelection(): void {
    this.shipsSelected = true;
  }

  // Submits high score to server
  private submitHighScore(): void {
    let playerOneName: string;
    let score = this.gameLogic.getPlayerScore("playerOne");
    if(this.multiplayer) {
      let playerTwoName: string;
      playerOneName = this.mpHighScoreForm.value.playerOneName.trim();
      playerTwoName = this.mpHighScoreForm.value.playerTwoName.trim();
      if (!playerOneName || !playerTwoName) {
        return;
      }
      score += this.gameLogic.getPlayerScore("playerTwo");
      this.highScoreService.addMpHighScore<MpHighScore>({playerOneName, playerTwoName, score} as MpHighScore).subscribe(
        () => this.router.navigateByUrl('/highscores')
      );
    } else {
      playerOneName = this.spHighScoreForm.value.playerOneName.trim();
      if (!playerOneName) {
        return;
      }
      this.highScoreService.addSpHighScore<SpHighScore>({playerOneName, score} as SpHighScore).subscribe(
        () => this.router.navigateByUrl('/highscores')
      );
    }
  }
}
