import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Bullet} from "../../game-objects/Bullet";
import {Battleship} from "../../game-objects/Battleship";
import {Direction} from "../../enums/direction";
import {Enemy} from "../../game-objects/Enemy";
import {LoaderService} from "../../services/loader.service";
import {GameBoundaries} from "../../game-objects/GameObject";

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
  private enemyMovementDirection: Direction;
  private enemyReachedBoundary: boolean;
  private enemyMovementCooldown: number;
  private enemyFireCooldown: number;
  private gameOver: boolean;
  private gameBoundaries: GameBoundaries;
  private loadedImages: Map<string, HTMLImageElement>;


  constructor(private loader: LoaderService) {}

  ngOnInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.gameBoundaries = {
      leftBoundary: 0,
      rightBoundary: this.ctx.canvas.width,
      lowerBoundary: this.ctx.canvas.height,
      upperBoundary: 0
    };
    this.enemyMovementDirection = Direction.RIGHT;
    this.enemyMovementCooldown = 15;
    this.enemyFireCooldown = 60;
    this.enemyReachedBoundary = false;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
  }

  ngAfterViewInit() {
    this.loader.resourcesLoaded$.subscribe( () => {
      this.loadedImages = this.loader.getImages();
      this.setupGame();
    });
    this.loadFiles();
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
    this.playerOne = new Battleship(
      this.loadedImages.get('RedFighter'),
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height,
      this.gameBoundaries
    );

    // Spawn enemies
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
      let enemiesPerRow: number =  15;

      let y: number = (img.width + 10) * j;
      for (let i = 0; i < enemiesPerRow; ++i) {
        let x: number = img.width + (img.width + 10) * i;
        let enemy = new Enemy(img, x, y, this.gameBoundaries);
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
        let bullet = new Bullet(this.loadedImages.get('Bullet'), this.playerOne.getX() + (this.playerOne.getWidth() / 2), this.playerOne.getY(), this.gameBoundaries);
        this.bullets.push(bullet);
        break;
      case("Enter"):
        this.gameLoop();
        break;
    }
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

    // Player movement
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw objects
    this.playerOne.draw(this.ctx);
    for (let enemy of this.enemies) {
      enemy.draw(this.ctx);
    }


    // Bullet movement
    for(let bullet of this.bullets) {
      bullet.move(Direction.UP, () => {
        let index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
      });
      bullet.draw(this.ctx);
    }

    for(let bullet of this.enemyBullets) {
      bullet.move(Direction.DOWN, () => {
        let index = this.enemyBullets.indexOf(bullet);
        this.enemyBullets.splice(index, 1);
      });
      bullet.draw(this.ctx);
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
      this.enemyFireCooldown = 60;

      let randomIndex = Math.floor(Math.random() * this.enemies.length);
      let randomEnemy = this.enemies[randomIndex];
      let bullet = new Bullet(
        this.loadedImages.get('EnemyBullet'),
        randomEnemy.getX() + (randomEnemy.getWidth() / 2),
        randomEnemy.getY(),
        this.gameBoundaries
      );
      this.enemyBullets.push(bullet);
    }

    if (this.enemies.length === 0) {
      this.gameOver = true;
    }

  };

}
