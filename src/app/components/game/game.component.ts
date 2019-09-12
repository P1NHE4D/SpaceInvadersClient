import {Component, HostListener, OnInit} from '@angular/core';
import {GameLogicService} from "../../services/game-logic.service";
import {GameSetupService} from "../../services/game-setup.service";
import {Bullet} from "../../materials/Bullet";
import {Battleship} from "../../materials/Battleship";
import {Direction} from "../../enums/direction";
import {Enemy} from "../../materials/Enemy";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [GameLogicService, GameSetupService]
})
export class GameComponent implements OnInit {

  private canvas;
  private ctx: CanvasRenderingContext2D;
  private playerOne: Battleship;
  private bullets: Bullet[];
  private enemyBullets: Bullet[];
  private enemies: Enemy[];
  private playerOneImg: HTMLImageElement;
  private bulletImg: HTMLImageElement;
  private enemyBulletImg: HTMLImageElement;
  private androidAlienImg: HTMLImageElement;
  private images: HTMLImageElement[];
  private enemyMovementDirection: Direction;
  private enemyReachedBoundary: boolean;
  private enemyMovementCooldown: number;
  private enemyFireCooldown: number;


  constructor(private gameLogic: GameLogicService) {
  }

  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.enemyMovementDirection = Direction.RIGHT;
    this.enemyMovementCooldown = 15;
    this.enemyFireCooldown = 45;
    this.enemyReachedBoundary = false;
    this.loadImages();
  }

  /**
   * Load game assets
   */
  loadImages(): void {
    this.images = [
      this.playerOneImg = new Image(),
      this.bulletImg = new Image(),
      this.enemyBulletImg = new Image(),
      this.androidAlienImg = new Image(),
    ];
    this.playerOneImg.src = "../../../assets/gameObjects/RedFighter.png";
    this.bulletImg.src = "../../../assets/gameObjects/Bullet.png";
    this.enemyBulletImg.src = "../../../assets/gameObjects/EnemyBullet.png";
    this.androidAlienImg.src = "../../../assets/gameObjects/AndroidAlien.png";
    for (let i = 0; i < this.images.length; ++i) {
      this.images[i].onload = () => {
        if (i === this.images.length - 1) {
          this.setupGame();
        }
      }
    }
  }

  setupGame() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "24pt Impact";
    this.ctx.fillText("Press 'ENTER' to start the game", 100, 100);
    this.bullets = [];
    this.enemyBullets = [];
    this.playerOne = new Battleship(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height,
      this.playerOneImg.width,
      this.playerOneImg.height,
      0,
      this.ctx.canvas.width,
    );
    this.ctx.drawImage(this.playerOneImg, this.playerOne.getX(), this.playerOne.getY());
    this.enemies = [];
    let rowSize: number = (this.ctx.canvas.width - (this.ctx.canvas.width % this.androidAlienImg.width) - 2 * this.androidAlienImg.width);
    let enemiesPerRow: number =  rowSize / (this.androidAlienImg.width + 10);

    // Spawn enemies
    for (let j = 0; j < 4; ++j) {
      let y: number = (this.androidAlienImg.width + 10) * j;
      for (let i = 0; i < enemiesPerRow; ++i) {
        let x: number = this.androidAlienImg.width + (this.androidAlienImg.width + 10) * i;
        let enemy = new Enemy(x, y, this.androidAlienImg.width, this.androidAlienImg.height, 0, this.ctx.canvas.width - this.androidAlienImg.width, this.ctx.canvas.height - this.androidAlienImg.height);
        this.enemies.push(enemy);
      }
    }

  }

  // TODO: Add keys for playerTwo
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    switch(event.key) {
      case("ArrowLeft"):
        this.playerOne.move(Direction.LEFT);
        break;
      case("ArrowRight"):
        this.playerOne.move(Direction.RIGHT);
        break;
      case(" "):
        let bullet = new Bullet(this.playerOne.getX() + (this.playerOne.getWidth() / 2), this.playerOne.getY(), this.bulletImg.width, this.bulletImg.height, 0);
        this.bullets.push(bullet);
        break;
      case("Enter"):
        this.gameLoop();
        break;
    }
  }

  // TODO: Add playerTwo image
  // TODO: Add enemy bullets
  // TODO: Add enemies
  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);

    // Player movement
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.playerOneImg, this.playerOne.getX(), this.playerOne.getY());

    // Bullet movement
    for(let bullet of this.bullets) {
      bullet.move(Direction.UP, () => {
        let index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
      });
      this.ctx.drawImage(this.bulletImg, bullet.getX(), bullet.getY());
    }

    for(let bullet of this.enemyBullets) {
      bullet.move(Direction.DOWN, () => {
        let index = this.enemyBullets.indexOf(bullet);
        this.enemyBullets.splice(index, 1);
      });
      this.ctx.drawImage(this.enemyBulletImg, bullet.getX(), bullet.getY());
    }


    //Check for bullet intersection
    for(let bullet of this.bullets) {
      for(let enemy of this.enemies) {
        if(bullet.intersectsWithObject(enemy.getX(), enemy.getWidth(), enemy.getY(), enemy.getHeight())) {
          let index = this.enemies.indexOf(enemy);
          this.enemies.splice(index, 1);
          index = this.bullets.indexOf(bullet);
          this.bullets.splice(index, 1);
        }
      }
    }

    // Enemy movement
    if ((this.enemyMovementCooldown -= 1) === 0) {
      this.enemyMovementCooldown = 15;

      for(let enemy of this.enemies) {
        if (enemy.boundaryReached(this.enemyMovementDirection)) {
          this.enemyReachedBoundary = true;
        }
      }

      if (this.enemyReachedBoundary) {
        for(let enemy of this.enemies) {
          enemy.move(Direction.DOWN);
        }
        if (this.enemyMovementDirection === Direction.RIGHT) {
          this.enemyMovementDirection = Direction.LEFT;
        } else {
          this.enemyMovementDirection = Direction.RIGHT;
        }
        this.enemyReachedBoundary = false;
      } else {
        for(let enemy of this.enemies) {
          enemy.move(this.enemyMovementDirection);
        }
      }
    }

    // Enemy fire
    if ((this.enemyFireCooldown -= 1) === 0) {
      this.enemyFireCooldown = 45;

      let randomIndex = Math.floor(Math.random() * this.enemies.length);
      let randomEnemy = this.enemies[randomIndex];
      let bullet = new Bullet(
        randomEnemy.getX() + (randomEnemy.getWidth() / 2),
        randomEnemy.getY(),
        this.enemyBulletImg.width,
        this.enemyBulletImg.height,
        this.ctx.canvas.height
      );
      this.enemyBullets.push(bullet);
    }

    for (let enemy of this.enemies) {
      this.ctx.drawImage(this.androidAlienImg, enemy.getX(), enemy.getY());
    }

  };

}
