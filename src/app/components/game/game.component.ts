import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Bullet} from "../../game-objects/Bullet";
import {LoaderService} from "../../services/loader.service";
import {GameObject} from "../../game-objects/GameObject";
import {Battleship} from "../../game-objects/Battleship";
import {Enemy} from "../../game-objects/Enemy";
import {GameLogicService} from "../../services/game-logic.service";
import {Explosion} from "../../game-objects/Explosion";

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

  private ctx: CanvasRenderingContext2D;
  private loadedImages: Map<string, HTMLImageElement>;
  private playerOne: Battleship;
  private playerOneBullets: Bullet[] = [];
  private playerTwo: Battleship;
  private playerTwoBullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private enemyBullets: Bullet[] = [];
  private explosions: Explosion[] = [];
  private gameOver: boolean = false;
  private cooldown: number = 40;
  private fireCooldown: number = 90;
  private gameLoaded: boolean = false;


  constructor(
    private loader: LoaderService,
    private gameLogic: GameLogicService
  ) {}

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.loader.resourcesLoaded$.subscribe( () => {
      this.loadedImages = this.loader.getImages();
      this.gameLoaded = true;
      this.setupGame();
    });
    this.loadFiles();
  }

  // TODO: Improve key handling to improve overall gameplay experience and smoothness
  // TODO: when both player hold down their movement keys, no player moves
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    if (this.gameLoaded) {
      let bullet: Bullet;
      switch (event.key) {
        case("Shift"):
          bullet = this.gameLogic.fireBullet(this.playerOne, this.loadedImages.get('PlayerOneBullet'), this.ctx);
          this.playerOneBullets.push(bullet);
          break;
        case("ArrowLeft"):
          this.gameLogic.movePlayerLeft(this.playerOne);
          break;
        case("ArrowRight"):
          this.gameLogic.movePlayerRight(this.playerOne);
          break;
        case("Enter"):
          // TODO: game loop started multiple times if enter pressed more than once
          this.gameLoop();
          break;
      }
      if (this.multiplayer) {
        switch(event.key) {
          case("Control"):
            let bullet: Bullet = this.gameLogic.fireBullet(this.playerTwo, this.loadedImages.get('PlayerTwoBullet'), this.ctx);
            this.playerTwoBullets.push(bullet);
            break;
          case("a"):
            this.gameLogic.movePlayerLeft(this.playerTwo);
            break;
          case("d"):
            this.gameLogic.movePlayerRight(this.playerTwo);
            break;
        }
      }
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
      {name: 'BlueFighter', type: 'image', src: '/assets/gameObjects/BlueFighter.png'},
      {name: 'PlayerOneBullet', type: 'image', src: '/assets/gameObjects/PlayerOneBullet.png'},
      {name: 'PlayerTwoBullet', type: 'image', src: '/assets/gameObjects/PlayerTwoBullet.png'},
      {name: 'EnemyBullet', type: 'image', src: '/assets/gameObjects/EnemyBullet.png'},
      {name: 'Android', type: 'image', src: '/assets/gameObjects/AndroidAlien.png'},
      {name: 'Squid', type: 'image', src: '/assets/gameObjects/SquidAlien.png'},
      {name: 'Death', type: 'image', src: '/assets/gameObjects/DeathAlien.png'},
      {name: 'TinyRedFighter', type: 'image', src: '/assets/gameObjects/TinyRedFighter.png'},
      {name: 'TinyBlueFighter', type: 'image', src: '/assets/gameObjects/TinyBlueFighter.png'},
      {name: 'A318', type: 'image', src: '/assets/gameObjects/A318.png'},
      {name: 'TinyA318', type: 'image', src: '/assets/gameObjects/TinyA318.png'},
      {name: 'Explosion', type: 'image', src: '/assets/gameObjects/explosion.png'},
    ]);
  }

  setupGame(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = "#FF0000";
    this.ctx.font = "24pt Impact";
    this.ctx.fillText("Press 'ENTER' to start the game", 100, 100);
    this.spawnEnemies();
    // spawn player
    let playerImage = this.loadedImages.get('A318');
    this.playerOne = this.gameLogic.spawnPlayer(
      playerImage,
      this.ctx,
      (this.ctx.canvas.width / 2) - playerImage.width / 2,
      this.ctx.canvas.height
    );
    if (this.multiplayer) {
      playerImage = this.loadedImages.get('BlueFighter');
      this.playerTwo = this.gameLogic.spawnPlayer(
        playerImage,
        this.ctx,
        (this.ctx.canvas.width / 2) + playerImage.width,
        this.ctx.canvas.height
      );
    }
  }

  gameLoop = () => {
    //TODO: spawn special enemies, e.g. ISS, UFO, nyan-nyan cat
    //TODO: add background music
    if (this.gameOver) {
      // TODO: Improve game over view
      // TODO: submit score to server and switch to hight score view
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "24pt Impact";
      this.ctx.fillText("GAME OVER", 100, 100);
      return;
    }

    //Check for player bullet intersections
    this.gameLogic.checkForBulletIntersections(this.playerOneBullets, this.enemies, (object, bullet) => {
      let enemy: Enemy = object as Enemy;
      let index = this.enemies.indexOf(enemy);
      let explosion = new Explosion(this.loadedImages.get("Explosion"), enemy.getX(), enemy.getY(), this.ctx, 32, 1);
      this.explosions.push(explosion);
      this.enemies.splice(index, 1);
      index = this.playerOneBullets.indexOf(bullet);
      this.playerOneBullets.splice(index, 1);
      if ((this.playerOne.getScore() % 1000) + enemy.getHitScore() >= 1000) {
        this.playerOne.addLife();
      }
      this.playerOne.addToScore(enemy.getHitScore());
    });
    if (this.multiplayer) {
      this.gameLogic.checkForBulletIntersections(this.playerTwoBullets, this.enemies, (object, bullet) => {
        let enemy: Enemy = object as Enemy;
        let index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
        index = this.playerTwoBullets.indexOf(bullet);
        this.playerTwoBullets.splice(index, 1);
        if ((this.playerTwo.getScore() % 1000) + enemy.getHitScore() >= 1000) {
          this.playerTwo.addLife();
        }
        this.playerTwo.addToScore(enemy.getHitScore());
      });
    }

    // Check enemy bullet intersections
    this.gameLogic.checkForBulletIntersection(this.enemyBullets, this.playerOne, (bullet) => {
      let index = this.enemyBullets.indexOf(bullet);
      this.enemyBullets.splice(index, 1);
      this.playerOne.removeLife();
      if (this.playerOne.getLives() === 0) {
        this.gameOver = true;
      }
      //TODO: Add explosion sound and animation
      //TODO: Stop game loop if enemy hit player and respawn player after pressing a button
    });
    if (this.multiplayer) {
      this.gameLogic.checkForBulletIntersection(this.enemyBullets, this.playerTwo, (bullet) => {
        let index = this.enemyBullets.indexOf(bullet);
        this.enemyBullets.splice(index, 1);
        this.playerTwo.removeLife();
        if (this.playerTwo.getLives() === 0) {
          this.gameOver = true;
        }
        //TODO: Add explosion sound and animation
        //TODO: Stop game loop if enemy hit player and respawn player after pressing a button
      });
    }

    // Check if there are still some enemies alive
    if (this.enemies.length === 0) {
      // TODO: increase level counter and difficulty
      this.spawnEnemies();
    }

    // move bullets
    this.gameLogic.moveBulletsUp(this.playerOneBullets, (bullet) => {
      let index = this.playerOneBullets.indexOf(bullet);
      this.playerOneBullets.splice(index, 1);
    });
    if (this.multiplayer) {
      this.gameLogic.moveBulletsUp(this.playerTwoBullets, (bullet) => {
        let index = this.playerTwoBullets.indexOf(bullet);
        this.playerTwoBullets.splice(index, 1);
      });
    }
    this.gameLogic.moveBulletsDown(this.enemyBullets, (bullet) => {
      let index = this.enemyBullets.indexOf(bullet);
      this.enemyBullets.splice(index, 1);
    });

    // move enemies
    if ((this.cooldown -= 1) === 0) {
      this.cooldown = 20;
      this.gameLogic.moveEnemies(this.enemies);
    }

    // initiate enemy fire
    if ((this.fireCooldown -= 1) === 0) {
      this.fireCooldown = 90;
      let randomIndex = Math.floor(Math.random() * this.enemies.length);
      let randomEnemy = this.enemies[randomIndex];
      let bullet = this.gameLogic.fireBullet(randomEnemy, this.loadedImages.get('EnemyBullet'), this.ctx);
      this.enemyBullets.push(bullet);
    }

    // redraw all objects
    requestAnimationFrame(this.gameLoop);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    //TODO: Adjust position of hud
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "12pt Impact";
    this.ctx.fillText(`P1 Score: ${this.playerOne.getScore()}`, 0, 300);
    if (this.multiplayer) {
      this.ctx.fillText(`P2 Score: ${this.playerTwo.getScore()}`, 0, 320);
    }
    //TODO: Adjust display of lives if greater than 5
    for (let i = 0; i < this.playerOne.getLives(); ++i) {
      let img: HTMLImageElement = this.loadedImages.get('TinyA318');
      this.ctx.drawImage(img, 10 + (i * (img.width + 5)), 350);
    }
    if (this.multiplayer) {
      for (let i = 0; i < this.playerTwo.getLives(); ++i) {
        let img: HTMLImageElement = this.loadedImages.get('TinyBlueFighter');
        this.ctx.drawImage(img, 10 + (i * (img.width + 5)), 370);
      }
    }
    this.redrawObjects();
  };

  redrawObjects(): void {
    this.playerOne.render();
    for (let explosion of this.explosions) {
      explosion.render();
      explosion.update(() => {
        let index = this.explosions.indexOf(explosion);
        this.explosions.splice(index, 1);
      });
    }
    for (let enemy of this.enemies) {
      enemy.render();
      enemy.update();
    }
    for (let bullet of this.playerOneBullets) {
      bullet.render();
    }
    for (let bullet of this.enemyBullets) {
      bullet.render();
    }
    if (this.multiplayer) {
      this.playerTwo.render();
      for (let bullet of this.playerTwoBullets) {
        bullet.render();
      }
    }
  }

  spawnEnemies(): void {
    for (let j = 0; j < 4; ++j) {
      let img: HTMLImageElement;
      let hitScore: number;
      switch(j % 3) {
        case 0:
          img = this.loadedImages.get('Android');
          hitScore = 10;
          break;
        case 1:
          img = this.loadedImages.get('Squid');
          hitScore = 20;
          break;
        case 2:
          img = this.loadedImages.get('Death');
          hitScore = 30;
          break;
      }
      this.enemies = this.enemies.concat(this.gameLogic.spawnEnemyRow(img, this.ctx, (j * (img.height + 10)), hitScore, 2, 30));
    }
  }
}
