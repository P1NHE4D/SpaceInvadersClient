import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Bullet} from "../../materials/Bullet";
import {Battleship} from "../../materials/Battleship";
import {Direction} from "../../enums/direction";
import {Enemy} from "../../materials/Enemy";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  private ctx: CanvasRenderingContext2D;
  private playerOne: Battleship;
  private bullets: Bullet[];
  private enemyBullets: Bullet[];
  private enemies: Enemy[];
  private playerOneImg: HTMLImageElement;
  private bulletImg: HTMLImageElement;
  private enemyBulletImg: HTMLImageElement;
  private androidAlienImg: HTMLImageElement;
  private loadedImages = new Map();
  private enemyMovementDirection: Direction;
  private enemyReachedBoundary: boolean;
  private enemyMovementCooldown: number;
  private enemyFireCooldown: number;
  private gameOver: boolean;


  constructor(private loader: LoaderService) {
  }

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.enemyMovementDirection = Direction.RIGHT;
    this.enemyMovementCooldown = 15;
    this.enemyFireCooldown = 45;
    this.enemyReachedBoundary = false;
    this.loader.resourcesLoaded$.subscribe( () => {
      this.setupGame();
    });
  }

  ngAfterViewInit() {
  }

  /**
   * Load game assets
   */
  loadFiles(): void {
    this.loader.preload([
      {name: 'RedFighter', type: 'image', src: '/assets/gameObjects/RedFighter.png'},
      {name: 'Bullet', type: 'image', src: '/assets/gameObjects/Bullet.png'},
      {name: 'EnemyBullet', type: 'image', src: '/assets/gameObjects/EnemyBullet.png'},
      {name: 'AndroidAlien', type: 'image', src: '/assets/gameObjects/AndroidAlien.png'}
    ]);
  }

  setupGame(): void {
    this.loadedImages = this.loader.getImages();
    this.androidAlienImg = this.loadedImages.get("AndroidAlien");
    this.playerOneImg = this.loadedImages.get("RedFighter");
    this.bulletImg = this.loadedImages.get("Bullet");
    this.enemyBulletImg = this.loadedImages.get("EnemyBullet");
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
    if (this.gameOver) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "24pt Impact";
      this.ctx.fillText("GAME OVER", 100, 100);
      return;
    }
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

    for(let bullet of this.enemyBullets) {
      if(bullet.intersectsWithObject(this.playerOne.getX(), this.playerOne.getWidth(), this.playerOne.getY(), this.playerOne.getHeight())) {
        this.gameOver = true;
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

    if (this.enemies.length === 0) {
      this.gameOver = true;
    }

  };

}
