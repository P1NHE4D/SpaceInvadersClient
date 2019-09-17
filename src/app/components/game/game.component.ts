import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Bullet} from "../../game-objects/Bullet";
import {LoaderService} from "../../services/loader.service";
import {GameBoundaries} from "../../game-objects/GameObject";
import {Battleship} from "../../game-objects/Battleship";
import {Enemy} from "../../game-objects/Enemy";
import {GameLogicService} from "../../services/game-logic.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameLogicService]
})
export class GameComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  private ctx: CanvasRenderingContext2D;
  private loadedImages: Map<string, HTMLImageElement>;
  private playerOne: Battleship;
  private enemies: Enemy[] = [];
  private friendlyBullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private boundaries: GameBoundaries;
  private gameOver: boolean = false;
  private cooldown: number = 40;
  private fireCooldown: number = 90;


  constructor(
    private loader: LoaderService,
    private gameLogic: GameLogicService
  ) {}

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.boundaries = {
      leftBoundary: 0,
      rightBoundary: 700,
      upperBoundary: 0,
      lowerBoundary: this.ctx.canvas.height
    };
    this.loader.resourcesLoaded$.subscribe( () => {
      this.loadedImages = this.loader.getImages();
      this.setupGame();
    });
    this.loadFiles();
  }

  // TODO: Improve key handling to improve overall gameplay experience and smoothness
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    switch(event.key) {
      case(" "):
        let bullet: Bullet = this.gameLogic.fireBullet(this.playerOne, this.loadedImages.get('Bullet'), this.boundaries);
        this.friendlyBullets.push(bullet);
        break;
      case("ArrowLeft"):
        this.gameLogic.movePlayerLeft(this.playerOne);
        break;
      case("ArrowRight"):
        this.gameLogic.movePlayerRight(this.playerOne);
        break;
      case("Enter"):
        this.gameLoop();
        break;
    }
  }

  /**
   * Load game assets
   */
  loadFiles(): void {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "24pt Impact";
    this.ctx.fillText("Loading...", 200, 200);
    this.loader.preload([
      {name: 'RedFighter', type: 'image', src: '/assets/gameObjects/RedFighter.png'},
      {name: 'Bullet', type: 'image', src: '/assets/gameObjects/Bullet.png'},
      {name: 'EnemyBullet', type: 'image', src: '/assets/gameObjects/EnemyBullet.png'},
      {name: 'Android', type: 'image', src: '/assets/gameObjects/AndroidAlien.png'},
      {name: 'Squid', type: 'image', src: '/assets/gameObjects/SquidAlien.png'},
      {name: 'Death', type: 'image', src: '/assets/gameObjects/DeathAlien.png'},
    ]);
  }

  setupGame(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#FF0000";
    this.ctx.font = "24pt Impact";
    this.ctx.fillText("Press 'ENTER' to start the game", 100, 100);
    for (let j = 0; j < 4; ++j) {
      let img: HTMLImageElement;
      switch(j % 3) {
        case 0:
          img = this.loadedImages.get('Android');
          break;
        case 1:
          img = this.loadedImages.get('Squid');
          break;
        case 2:
          img = this.loadedImages.get('Death');
          break;
      }
      this.enemies = this.enemies.concat(this.gameLogic.spawnEnemyRow(img, (j * (img.height + 10)), this.boundaries));
    }
    let playerImage = this.loadedImages.get('RedFighter');
    this.playerOne = this.gameLogic.spawnPlayer(
      playerImage,
      (this.boundaries.rightBoundary / 2) - playerImage.width / 2,
      this.boundaries.lowerBoundary,
      this.boundaries
    );
  }

  gameLoop = () => {
    if (this.gameOver) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "24pt Impact";
      this.ctx.fillText("GAME OVER", 100, 100);
      return;
    }
    requestAnimationFrame(this.gameLoop);

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.gameLogic.checkForBulletIntersections(this.friendlyBullets, this.enemies, (object, bullet) => {
      let index = this.enemies.indexOf(object as Enemy);
      this.enemies.splice(index, 1);
      index = this.friendlyBullets.indexOf(bullet);
      this.friendlyBullets.splice(index, 1);
    });
    this.gameLogic.checkForBulletIntersection(this.enemyBullets, this.playerOne, (bullet) => {
      let index = this.enemyBullets.indexOf(bullet);
      this.enemyBullets.splice(index, 1);
      this.gameOver = true;
    });
    this.gameLogic.moveBulletsUp(this.friendlyBullets, (bullet) => {
      let index = this.friendlyBullets.indexOf(bullet);
      this.friendlyBullets.splice(index, 1);
    });
    this.gameLogic.moveBulletsDown(this.enemyBullets, (bullet) => {
      let index = this.enemyBullets.indexOf(bullet);
      this.enemyBullets.splice(index, 1);
    });
    if ((this.cooldown -= 1) === 0) {
      this.cooldown = 40;
      this.gameLogic.moveEnemies(this.enemies);
    }
    if ((this.fireCooldown -= 1) === 0) {
      this.fireCooldown = 90;
      let randomIndex = Math.floor(Math.random() * this.enemies.length);
      let randomEnemy = this.enemies[randomIndex];
      let bullet = this.gameLogic.fireBullet(randomEnemy, this.loadedImages.get('EnemyBullet'), this.boundaries);
      this.enemyBullets.push(bullet);
    }
    this.redrawObjects();
  };

  redrawObjects(): void {
    this.playerOne.draw(this.ctx);
    for (let enemy of this.enemies) {
      enemy.draw(this.ctx);
    }
    for (let bullet of this.friendlyBullets) {
      bullet.draw(this.ctx);
    }
    for (let bullet of this.enemyBullets) {
      bullet.draw(this.ctx);
    }
  }
}
