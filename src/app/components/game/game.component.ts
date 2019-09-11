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


  constructor() {
  }

  ngOnInit() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.canvas.width = 700;
    this.ctx.canvas.height = 400;
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
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    switch(event.key) {
      case("ArrowLeft"):
        this.playerOne.moveLeft();
        break;
      case("ArrowRight"):
        this.playerOne.moveRight();
        break;
      case(" "):
        let bullet = new Bullet(this.playerOne.getCenteredX(), this.playerOne.getY(), 0);
        this.bullets.push(bullet);
        break;
      case("Enter"):
        this.gameLoop();
        break;
    }
  }

  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.drawImage(this.playerOneImg, this.playerOne.getX(), this.playerOne.getY());
    for(let bullet of this.bullets) {
      bullet.move(Direction.UP, () => {
        const index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
      });
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "24pt Impact";
      this.ctx.fillText(`Bullets: ${this.bullets.length}`, 100, 100);
      this.ctx.drawImage(this.bulletImg, bullet.getX(), bullet.getY());
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
   * Moves the battleship to the left by a predefined value
   */
  public moveLeft(): void {
    if (this.xPos - 12 > this.leftBoundary) {
      this.xPos -= 12;
    }
  }

  /**
   * Moves the battleship to the right by a predefined value
   */
  public moveRight(): void {
    if (this.xPos + 12 < this.rightBoundary) {
      this.xPos += 12;
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
   * @param boundary travel boundary of the bullet
   */
  constructor(
    private xPos: number,
    private yPos: number,
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
   * Returns the x-position of the bullet
   */
  public getX() {
    return this.xPos;
  }

  /**
   * Returns the y-position of the bullet
   */
  public getY() {
    return this.yPos;
  }
}

export enum Direction{
  DOWN,
  UP
}

export class Enemy {

  constructor(
    private xPos: number,
    private yPos: number
  ) {}

  public fire() {
  }

  public move() {

  }

  public getX() {
    return this.xPos;
  }

  public getY() {
    return this.yPos;
  }
}

export class CanvasBoundaries {

  constructor(
    private readonly left: number,
    private readonly right: number,
    private readonly upper: number,
    private readonly lower: number
  ) {}

  public getLeft(): number {
    return this.left;
  }

  public getRight(): number {
    return this.right;
  }

  public getUpper(): number {
    return this.upper;
  }

  public getLower(): number {
    return this.lower;
  }
}
