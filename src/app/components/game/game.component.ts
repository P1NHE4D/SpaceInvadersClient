import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {EnemyMetaData, GameLogicService} from "../../services/game-logic.service";
import {Explosion} from "../../game-objects/Explosion";
import {HighScoreService} from "../../services/high-score.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MpHighScore} from "../../models/mp-high-score";
import {SpHighScore} from "../../models/sp-high-score";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameLogicService]
})
export class GameComponent implements OnInit, OnDestroy {

  @Input() multiplayer: boolean = false;
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef;
  private displayPreGameModal: string = 'block';
  private displayGameOverModal: string = 'none';
  private spHighScoreForm: FormGroup;
  private mpHighScoreForm: FormGroup;
  private ctx: CanvasRenderingContext2D;
  private availableBattleships: HTMLImageElement[] = [];
  private playerOneSelectedBattleship: HTMLImageElement;
  private playerTwoSelectedBattleship: HTMLImageElement;
  private shipsSelected: boolean = false;

  private gameLoaded: boolean = false;
  private stopGameLoop: boolean = false;
  private enemyMetaData: EnemyMetaData[] = [];
  private fireCoolDown: number = 25;
  private cooldownCountPlayerOne: number = 0;
  private cooldownCountPlayerTwo: number = 0;

  private keys: Map<string, boolean> = new Map<string, boolean>();


  constructor(
    private loader: LoaderService,
    private gameLogic: GameLogicService,
    private highScoreService: HighScoreService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Forms setup
    this.spHighScoreForm = this.formBuilder.group({
      playerOneName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])]
    });
    this.mpHighScoreForm = this.formBuilder.group({
      playerOneName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      playerTwoName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])]
    });

    // Canvas setup
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;

    // Load and setup resources
    this.loader.resourcesLoaded$.subscribe( () => {
      this.availableBattleships.push(
        this.loader.getImage('RedFighter'),
        this.loader.getImage('BlueFighter'),
        this.loader.getImage('A318'),
        this.loader.getImage('Eurofighter')
      );
      this.playerOneSelectedBattleship = this.loader.getImage('RedFighter');
      this.playerTwoSelectedBattleship = this.loader.getImage('RedFighter');
      this.enemyMetaData = [
        {image: this.loader.getImage("Android"), hitScore: 10, frames: 2, ticksPerFrame: 30},
        {image: this.loader.getImage("Squid"), hitScore: 20, frames: 2, ticksPerFrame: 30},
        {image: this.loader.getImage("Death"), hitScore: 30, frames: 2, ticksPerFrame: 30}
      ];
      this.gameLoaded = true;
    });
    this.loadGameResources();
  }

  ngOnDestroy() {
    this.stopGameLoop = true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keys.set(event.key, true);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    this.keys.set(event.key, false);
  }

  // Loads all assets used in the game
  loadGameResources(): void {
    this.loader.preload([
      {name: 'RedFighter', type: 'image', src: '/assets/game-assets/RedFighter.png'},
      {name: 'BlueFighter', type: 'image', src: '/assets/game-assets/BlueFighter.png'},
      {name: 'A318', type: 'image', src: '/assets/game-assets/A318.png'},
      {name: 'Eurofighter', type: 'image', src: '/assets/game-assets/Eurofighter.png'},
      {name: 'PlayerOneBullet', type: 'image', src: '/assets/game-assets/PlayerOneBullet.png'},
      {name: 'PlayerTwoBullet', type: 'image', src: '/assets/game-assets/PlayerTwoBullet.png'},
      {name: 'EnemyBullet', type: 'image', src: '/assets/game-assets/EnemyBullet.png'},
      {name: 'Android', type: 'image', src: '/assets/game-assets/AndroidAlien.png'},
      {name: 'Squid', type: 'image', src: '/assets/game-assets/SquidAlien.png'},
      {name: 'Death', type: 'image', src: '/assets/game-assets/DeathAlien.png'},
      {name: 'Explosion', type: 'image', src: '/assets/game-assets/Explosion.png'},
      {name: 'BigExplosion', type: 'image', src: '/assets/game-assets/BigExplosion.png'},
      {name: 'LaserShot', type: 'audio', src: '/assets/game-assets/laser.mp3'},
      {name: 'ExplosionSound01', type: 'audio', src: '/assets/game-assets/explosion01.mp3'},
      {name: 'ExplosionSound02', type: 'audio', src: '/assets/game-assets/explosion02.mp3'}
    ]);
  }

  /**
   * Spawns player(s) and enemies
   */
  setupGame(): void {

    let playerImage = this.playerOneSelectedBattleship;
    let x: number = (this.ctx.canvas.width / 2) - playerImage.width / 2;
    let y: number = this.ctx.canvas.height;
    this.gameLogic.spawnPlayer("playerOne", playerImage, this.ctx, x, y);

    if (this.multiplayer) {
      playerImage = this.playerTwoSelectedBattleship;
      x = (this.ctx.canvas.width / 2) + playerImage.width;
      this.gameLogic.spawnPlayer("playerTwo", playerImage, this.ctx, x, y);
    }

    this.gameLogic.spawnEnemies(this.enemyMetaData, this.ctx);
  }

  /**
   * game loop handling the gameplay
   */
  gameLoop = () => {

    // stops game loop if component is being destroyed
    if (this.stopGameLoop) {
      return;
    }

    // Check for game over
    if (this.gameLogic.gameOver) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.displayGameOverModal = 'block';
      return;
    }

    // Handle player input
    if (this.cooldownCountPlayerOne < this.fireCoolDown) {
      ++this.cooldownCountPlayerOne;
    }
    if(this.keys.get("ArrowLeft") === true) {
      this.gameLogic.movePlayerLeft("playerOne");
    } else if (this.keys.get("ArrowRight") === true){
      this.gameLogic.movePlayerRight("playerOne");
    }
    if(this.keys.get("ArrowUp") === true && this.cooldownCountPlayerOne === this.fireCoolDown) {
      this.cooldownCountPlayerOne = 0;
      this.gameLogic.fireBullet("playerOne", this.loader.getImage("PlayerOneBullet"), this.ctx, this.loader.getAudio("LaserShot"));
    }

    if (this.multiplayer) {
      if (this.cooldownCountPlayerTwo < this.fireCoolDown) {
        ++this.cooldownCountPlayerTwo;
      }
      if(this.keys.get("a") === true) {
        this.gameLogic.movePlayerLeft("playerTwo");
      } else if (this.keys.get("d") === true) {
        this.gameLogic.movePlayerRight("playerTwo");
      }
      if(this.keys.get("w") === true && this.cooldownCountPlayerTwo === this.fireCoolDown) {
        this.cooldownCountPlayerTwo = 0;
        this.gameLogic.fireBullet("playerTwo", this.loader.getImage("PlayerTwoBullet"), this.ctx, this.loader.getAudio("LaserShot"));
      }
    }

    // handle game objects
    this.gameLogic.checkForPlayerBulletIntersections(this.loader.getImage("Explosion"), this.ctx, 32, 1, this.loader.getAudio("ExplosionSound01"));
    this.gameLogic.checkForEnemyBulletIntersections(this.loader.getImage("BigExplosion"), this.ctx, 32, 1, this.loader.getAudio("ExplosionSound02"));
    if (this.gameLogic.enemies.length === 0) {
      this.gameLogic.increaseLevel();
      this.gameLogic.increaseDifficulty();
      this.gameLogic.spawnEnemies(this.enemyMetaData, this.ctx);
    }
    this.gameLogic.movePlayerBullets();
    this.gameLogic.moveEnemyBullets();
    this.gameLogic.moveEnemies();
    this.gameLogic.fireEnemyBullet(this.loader.getImage("EnemyBullet"), this.ctx);

    // redraw all objects
    requestAnimationFrame(this.gameLoop);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.gameLogic.renderGameObjects();
  };


  /**
   * hides the pre-game modal window
   */
  hidePreGameModal(): void {
    this.displayPreGameModal = 'none';
  }

  /**
   * sets the battleship image selected by player one
   * @param image selected image
   */
  selectPlayerOneShip(image: HTMLImageElement): void {
    this.playerOneSelectedBattleship = image;
  }

  /**
   * sets the battleship image selected by player two
   * @param image selected image
   */
  selectPlayerTwoShip(image: HTMLImageElement): void {
    this.playerTwoSelectedBattleship = image;
  }

  /**
   * confirms the ship selection
   */
  confirmSelection(): void {
    this.shipsSelected = true;
  }

  /**
   * Submits high score to server
   */
  submitHighScore(): void {
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
