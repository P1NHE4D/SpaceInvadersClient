import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
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


  constructor() {
  }

  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
    this.enemyMovementDirection = Direction.RIGHT;
    this.enemyMovementCooldown = 15;
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
      0,
      this.ctx.canvas.width,
      this.playerOneImg
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
        let bullet = new Bullet(this.playerOne.getCenteredX(), this.playerOne.getY(), this.bulletImg.width, this.bulletImg.height, 0);
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

    for (let enemy of this.enemies) {
      this.ctx.drawImage(this.androidAlienImg, enemy.getX(), enemy.getY());
    }

  };

}

export class Battleship {

  /**
   * Instantiates a new battleship
   * @param xPos initial y-position of the battleship
   * @param yPos initial x-position of the battleship
   * @param leftBoundary left game boundary
   * @param rightBoundary right game boundary
   * @param img image used for the battleship
   */
  constructor(
    private xPos: number,
    private yPos: number,
    private readonly leftBoundary: number,
    private readonly rightBoundary: number,
    private img: HTMLImageElement
  ) {
    this.rightBoundary -= this.img.width;
    this.xPos -= (this.img.width / 2);
    this.yPos -= this.img.height;
  }

  /**
   * Moves the battleship in the desired direction by a predefined value
   * @param direction Desired direction
   */
  public move(direction: Direction): void {
    switch(direction) {
      case Direction.LEFT:
        if (this.xPos - 12 > this.leftBoundary) {
          this.xPos -= 12;
        }
        break;
      case Direction.RIGHT:
        if (this.xPos + 12 < this.rightBoundary) {
          this.xPos += 12;
        }
        break;
    }
  }

  /**
   * Returns x-position of battleship
   */
  public getX(): number {
    return this.xPos;
  }

  /**
   * Returns y-position of battleship
   */
  public getY(): number {
    return this.yPos;
  }

  /**
   * Returns x-position of battleship adjusted by image size
   */
  public getCenteredX(): number {
    return this.xPos + (this.img.width / 2);
  }
}

export class Bullet {

  /**
   * Instantiates a new bullet
   * @param xPos initial x-position of the bullet
   * @param yPos initial y-position of the bullet
   * @param width width of the bullet
   * @param height height of the bullet
   * @param boundary travel boundary of the bullet
   */
  constructor(
    private xPos: number,
    private yPos: number,
    private width: number,
    private height: number,
    private boundary: number
  ) {}

  /**
   * Moves in the desired direction by a predefined value
   * @param direction Direction in which the bullet is supposed to travel
   * @param boundaryReached Function that should be called as soon as the bullet reaches the boundary
   */
  move(direction: Direction, boundaryReached: () => any): void {
    switch(direction) {
      case Direction.UP:
        if (this.yPos - 3 > this.boundary) {
          this.yPos -= 3;
        } else {
          boundaryReached();
        }
        break;
      case Direction.DOWN:
        if (this.yPos + 3 < this.boundary) {
          this.yPos += 3;
        } else {
          boundaryReached();
        }
        break;
    }
  }

  /**
   * Checks if the bullet intersects with a game world object
   * @param xPos x-position of game world object
   * @param width width of game world object
   * @param yPos y-position of game world object
   * @param height height of game world object
   */
  public intersectsWithObject(xPos: number, width: number, yPos: number, height: number) {
    return this.xPos + this.width >= xPos && this.xPos <= xPos + width && this.yPos - this.height <= yPos && this.yPos >= yPos - height;
  }

  /**
   * Returns the x-position of the bullet
   */
  public getX(): number {
    return this.xPos;
  }

  /**
   * Returns the y-position of the bullet
   */
  public getY(): number {
    return this.yPos;
  }
}

export class Enemy {
  private readonly movementSpeed: number = 6;

  /**
   * Instantiates a new enemy
   * @param xPos initial x-position of enemy
   * @param yPos initial y-position of enemy
   * @param width Width of the enemy
   * @param height Height of the enemy
   * @param leftBoundary Left boundary of game area
   * @param rightBoundary Right boundary of game area
   * @param lowerBoundary Lower boundary of game area
   */
  constructor(
    private xPos: number,
    private yPos: number,
    private width: number,
    private height: number,
    private leftBoundary: number,
    private rightBoundary: number,
    private lowerBoundary: number
  ) {}

  /**
   * Moves the enemy in the desired direction by a predefined value
   * @param direction Desired movement direction
   * @requires direction != null
   */
  public move(direction: Direction): void {
    switch(direction) {
      case Direction.RIGHT:
        if (this.xPos + this.movementSpeed < this.rightBoundary) {
          this.xPos += this.movementSpeed;
        }
        break;
      case Direction.LEFT:
        if (this.xPos - this.movementSpeed > this.leftBoundary) {
          this.xPos -= this.movementSpeed;
        }
        break;
      case Direction.DOWN:
        if (this.yPos + this.movementSpeed < this.lowerBoundary) {
          this.yPos += this.movementSpeed;
        }
        break;
    }
  }

  /**
   * Checks if the enemy reached a boundary with respect to its current movement direction
   * @param direction movement direction of the enemy
   * @requires direction != null
   */
  public boundaryReached(direction: Direction): boolean {
    switch(direction) {
      case Direction.RIGHT:
        return this.xPos + this.movementSpeed >= this.rightBoundary;
      case Direction.LEFT:
        return this.xPos - this.movementSpeed <= this.leftBoundary;
      case Direction.DOWN:
        return this.yPos + this.movementSpeed >= this.lowerBoundary;
    }
  }

  /**
   * Returns x-position of enemy
   */
  public getX(): number {
    return this.xPos;
  }

  /**
   * Returns y-position of enemy
   */
  public getY(): number {
    return this.yPos;
  }

  /**
   * Returns width of enemy
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Returns height of enemy
   */
  public getHeight(): number {
    return this.height;
  }
}

/**
 * Enum used for indicating the movement direction of an object
 */
export enum Direction{
  DOWN,
  UP,
  LEFT,
  RIGHT
}
